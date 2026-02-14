import path from "node:path";
import { fileURLToPath } from "node:url";
import { JobQueue } from "./jobQueue.js";
import { resolve } from "node:dns";
import { WorkerWrapper } from "./workerWrapper.js";
import { Worker } from "node:worker_threads";
import { Job } from "../../services/fileService.js";

//Message sent from Worker to MainThread
export interface WorkerResultMessage {
  id: string; //Id of the job that just finished
  okeeyy: boolean; //Whether the job was a success or failure
  result?: unknown;
  error?: string; //error message incase of failure
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
Worker pool does four major things
1) Create Worker Threads 
2) keeps a queue of incoming jobs
3) Assign jobs to free workers
4) Return results back to the caller using Promises
*/

export class WorkerPool {
  private size: number; //how many worker we want?
  private queue = new JobQueue(); //stores job waiting to be processed
  private pending = new Map<
    string,
    { resolve: (v: unknown) => void; reject: (err: Error) => void }
  >();
  private workers: WorkerWrapper[] = []; //Stores all workers in the pool with it's state

  private workerEntry = path.resolve(__dirname, "..", "worker.js"); //this gives us /src/workers/worker.js (or dist/workers/worker.js after build)

  constructor(options: { size: number }) {
    //options is just a normal parameter which is an object with size property and size must be number
    this.size = options.size;
  }

  //Create Workers
  start(): void {
    //if size is 4 then we create 4 workers using the for loop
    for (let i = 0; i < this.size; i++) {
      //creating workers
      const isDev = process.env.NODE_ENV !== "production";
      const w = new Worker(this.workerEntry, {
        env: process.env,
        ...(isDev && { execArgv: ["--loader", "ts-node/esm"] }), //we need this --loader and ts-node/esm in development because our worker file is in typescript and
        // we want to run it without building the whole project every time but in production we will build the project so we don't need this
      }); //this runs worker.js in a seperate thread

      //Wrapping the worker in our WorkerWrapper class to keep track of it's state and what job is it doing.
      const ww = new WorkerWrapper(w);

      //when the worker from worker.ts sends message we handle it in onMessage function
      //and aru lai ni testai testai ho
      w.on("message", (message) =>
        this.onMessage(ww, message as WorkerResultMessage),
      );
      w.on("error", (error) => this.onError(ww, error as Error));
      w.on("exit", (code) => this.onExit(ww, code));

      //storing all the workers created in the pool
      this.workers.push(ww);
    }
  }

  //giving the job to the workerpool which will then return a promise
  //TPayload is the type of data that the job needs to process
  //TResult is the type of data that the worker will return after processing the job
  executeJob<TPayload, TResult>(job: Job<TPayload>): Promise<TResult> {
    return new Promise((resolve, reject) => {
      //storing the resolve and reject function of the promise in pending map with
      // job id as key so that when worker sends result back we can resolve or reject
      // the promise accordingly
      this.pending.set(job.id, {
        resolve: (value: unknown) => resolve(value as TResult),
        reject,
      });
      //putting the job in the queue and then we will assign it to a free worker
      this.queue.push(job as Job<unknown>);
      //if any worker is free send the job to that worker
      this.drain();
    }) as Promise<TResult>;
  }

  //Turn of all the workers in the pool
  shutdown(): void {
    for (const ww of this.workers) {
      ww.worker.terminate();
    }
  }

  //find non busy worker and assign job form the queue
  private drain(): void {
    for (const ww of this.workers) {
      if (this.queue.length === 0) {
        return; // if there is no job in the queue we return
      }
      if (ww.busy) {
        continue; //if the current worker is busy we skip to next worker
      }
      const job = this.queue.shift(); //get the first job from the queue
      //if there is no job then we get undefiend so we check for that as well
      if (!job) {
        return;
      }
      //if we reached here then the worker is free and we have a job to assign
      ww.assignJob(job.id);
      ww.worker.postMessage(job); //send the job to the worker thread in worker.ts
      //postMessage is a method to send data from main thread to worker and worker to main.
    }
  }

  //when the worker finishes the job
  //we mark the worker as free and resolve or reject any pending promise with the result
  //sent by the worker and execute next job in the queue if there is any
  private onMessage(ww: WorkerWrapper, message: WorkerResultMessage): void {
    //lets find the promise that belongs to this job
    //earlier we stored it in a map with a key
    const record = this.pending.get(message.id);

    //now we mark the worker as free
    ww.release();
    //use drain method to find assign next job
    this.drain();

    if (!record) {
      return;
    }

    //remove the job from pending map, as we have finished the job
    this.pending.delete(message.id);

    if (message.okeeyy) {
      record.resolve(message.result);
    } else {
      record.reject(new Error(message.error || "Unknown error"));
    }
  }

  //What to do when the worker fails?
  private onError(ww: WorkerWrapper, error: Error): void {
    if (ww.currentJobId) {
      const record = this.pending.get(ww.currentJobId);
      if (record) {
        this.pending.delete(ww.currentJobId);
        record.reject(error);
      }
    }
    ww.release();
    this.drain();
  }

  //This function runs when the worker stops for some reason
  private onExit(ww: WorkerWrapper, code: number): void {
    if (ww.currentJobId) {
      const record = this.pending.get(ww.currentJobId);
      if (record) {
        this.pending.delete(ww.currentJobId);
        record.reject(new Error(`Worker stopped with exit code ${code}`));
      }
    }
    ww.release();
    this.drain();
  }
}
