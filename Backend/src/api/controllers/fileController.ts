import { Request, Response, NextFunction } from "express";
import "multer"; // Import to ensure Express.Multer types are augmented
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import { WorkerPool } from "../../workers/pool/workerPool.js";
import { buildJpgToPdfJob } from "../../services/fileService.js";
import path from "node:path";
import { safeUnlink } from "../../utils/fileUtils.js";

export function makeFileController(dependencies: { workerPool: WorkerPool }) {
  const { workerPool } = dependencies;

  //feature one: JPg to pdf
  const jpgtoPdf = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length === 0) {
        return next(new AppError("No files uploaded", 400));
      }

      const job = buildJpgToPdfJob(
        files.map((file) => ({
          path: file.path,
          orginalname: file.originalname,
        })),
      );

      const result = await workerPool.executeJob<
        typeof job.payload,
        { outputPath: string }
      >(job);

      //res.download forces the browser to download the file
      //resultl.outputPath may me /src/outputs/123.pdf
      //path.basename... just give us 123.pdf so that the downloaded file is named 123.pdf
      res.download(
        result.outputPath,
        path.basename(result.outputPath),
        async () => {
          //clean up function to delete the output file after download
          await safeUnlink(result.outputPath);
          //now we must delete the uploaded files as well to save space on our server
          await Promise.allSettled(files.map((file) => safeUnlink(file.path)));
        },
      );
    },
  );
  return { jpgtoPdf };
}
