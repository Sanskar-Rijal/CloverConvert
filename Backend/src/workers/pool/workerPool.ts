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
  okeeyy: boolean; //Whether the job was a success or failuer
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

  private workerEntry = path.resolve(__dirname, "..", "worker.ts"); //this gives us /src/workers/worker.ts

  constructor(options: { size: number }) {
    //options is just a normal parameter which is an object with size property and size must be number
    this.size = options.size;
  }

  //Create Workers
  start(): void {
    //if size if 4 then we create 4 workers using the for loop
    for (let i = 0; i < this.size; i++) {
      //creating workers
      const w = new Worker(this.workerEntry, {
        env: process.env,
        execArgv: ["--loader", "ts-node/esm"],
      }); //this runs worker.ts in a seperate thread

      //Wrapping the worker in our WorkerWrapper class to keep track of it's state and what job is it doing.
      const ww = new WorkerWrapper(w);

      //when the worker from worker.ts sends message we handle it in onMessage function
      //and aru lai ni testai testai ho
      w.on("message", (message) =>
        this.onMessage(ww, message as WorkerResultMessage),
      );
      w.on("error", (error) => this.onError(ww, error));
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
}
