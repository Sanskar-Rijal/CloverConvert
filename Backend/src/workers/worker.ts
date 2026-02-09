import { parentPort } from "node:worker_threads"; //ParentPort is the communication channel
import { Job } from "../services/fileService.js";
import { jpgToPdf } from "./tasks/jpgToPdf.js";
import { pdfToJpg } from "./tasks/pdfToJpg.js";
import { compressPdf } from "./tasks/compressPdf.js";

//between worker thread and main thread. Without this worker can't send results or receive jobs

if (!parentPort) {
  throw new Error("Worker started without parent port");
}

//this is the code that each worker runs when it starts
//now we listen for any job sent by the main thread using parentPort.on method
//whenever the code ww.worker.postMessage(job); runs on the main thread, this handler runs
parentPort.on("message", async (job: Job<any>) => {
  try {
    switch (job.type) {
      case "JPG_TO_PDF": {
        const result = await jpgToPdf(job.payload);
        //send success result back to the main thread
        parentPort?.postMessage({ id: job.id, okeeyy: true, result });
        return;
      }
      case "PDF_TO_JPG": {
        const result = await pdfToJpg(job.payload);
        //send success result back to the main thread
        parentPort?.postMessage({ id: job.id, okeeyy: true, result });
        return;
      }
      case "PDF_COMPRESS": {
        const result = await compressPdf(job.payload);
        parentPort?.postMessage({ id: job.id, okeeyy: true, result });
        return;
      }
      // case "PDF_TO_WORD": {
      //   const result = await pdfToWord();
      //   parentPort?.postMessage({ id: job.id, okeeyy: true, result });
      //   return;
      // }
      // case "WORD_TO_PDF": {
      //   const result = await wordToPdf();
      //   parentPort?.postMessage({ id: job.id, okeeyy: true, result });
      //   return;
      // }
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  } catch (error) {
    parentPort?.postMessage({
      id: job.id,
      okeeyy: false,
      error: (error as Error).message || "Unknown error",
    });
  }
});
