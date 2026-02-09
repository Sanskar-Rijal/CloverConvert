import { Router } from "express";
import { WorkerPool } from "../workers/pool/workerPool.js";
import { makeFileController } from "./controllers/fileController.js";
import multer from "multer";
import { ensureDirectoryExists, makeSafeFileName } from "../utils/fileUtils.js";
import {
  MAX_FILE_MB,
  MAX_IMAGES_PER_REQUEST,
  UPLOAD_DIR,
} from "../utils/constants.js";

export function buildRoutes(dependencies: { workerPool: WorkerPool }) {
  const router = Router();
  //getting controller
  const controller = makeFileController({
    workerPool: dependencies.workerPool,
  });

  //using multer for disk storage
  const multerStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        await ensureDirectoryExists(UPLOAD_DIR);
        //cb accepts two arguments, first one is error and second one is the destination path
        //we assume we have no error
        cb(null, UPLOAD_DIR);
      } catch (error) {
        cb(error as Error, UPLOAD_DIR);
      }
    },
    filename: (req, file, cb) => {
      cb(null, makeSafeFileName(file.originalname));
    },
  });

  const upload = multer({
    storage: multerStorage,
    limits: { fileSize: MAX_FILE_MB * 1024 * 1024 },
  });

  router.post(
    "/jpg-to-pdf",
    upload.array("images", MAX_IMAGES_PER_REQUEST),
    controller.jpgtoPdf,
  );
  router.post("/pdf-to-jpg", upload.array("pdf", 1), controller.pdfToJpg);
  router.post("/compress-pdf", upload.array("pdf", 1), controller.compressPdf);
  router.post("/word-to-pdf", upload.array("word", 1), controller.wordToPdf);
  return router;
}
