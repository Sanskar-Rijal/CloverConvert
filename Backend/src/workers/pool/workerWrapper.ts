import { Worker } from "node:worker_threads";

//Creating wrapper class for worker to know
//1)Whether the worker is busy or not
//2)Which job the worker is currently Processing

export class WorkerWrapper {
  worker: Worker;
  busy: boolean = false;
  currentJobId: string | null = null;

  constructor(worker: Worker) {
    this.worker = worker;
  }

  assignJob(jobId: string):void {
    this.busy=true;
    this.currentJobId = jobId;
  }

  release():void{
    this.busy = false;
    this.currentJobId =null;
  }
}
