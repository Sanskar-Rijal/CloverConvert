import { Job } from "../../services/fileService.js";

//Creating simple fifo job queue

export class JobQueue {
  private queue: Job<unknown>[] = [];

  //Adding a job to the end of the queue
  push(job: Job<unknown>): void {
    this.queue.push(job);
  }
  //shift removes first element from the array and returns it
  //if array is empty return undefined
  shift(): Job<unknown> | undefined {
    //returns the first job in queue or undefined so we wrote | undefined
    return this.queue.shift();
  }

  //get length of the queue
  get length(): number {
    return this.queue.length;
  }
}
