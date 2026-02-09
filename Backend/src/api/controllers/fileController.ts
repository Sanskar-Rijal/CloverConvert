import { Request, Response, NextFunction } from "express";
import "multer"; // Import to ensure Express.Multer types are augmented
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import { WorkerPool } from "../../workers/pool/workerPool.js";
import {
  buildCompressPdfJob,
  buildJpgToPdfJob,
  buildPdftoJpgJob,
  buildWordToPdfJob,
  qualityType,
} from "../../services/fileService.js";
import path from "node:path";
import { safeRemoveDir, safeUnlink } from "../../utils/fileUtils.js";

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

  //Feature two: Pdf to Jpg
  const pdfToJpg = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length !== 1) {
        return next(new AppError("Please upload a pdf file", 400));
      }

      const file = files[0];

      if (!file?.originalname.endsWith(".pdf")) {
        return next(new AppError("Please upload a valid pdf file", 400));
      }

      const dpi = 150;
      const job = buildPdftoJpgJob(
        {
          path: file.path,
          orginalname: file.originalname,
        },
        {
          dpi: dpi,
        },
      );

      const result = await workerPool.executeJob<
        typeof job.payload,
        { zipPath: string }
      >(job);

      //now download the zip file on success
      res.download(result.zipPath, "your_sweet_images.zip", async () => {
        //cleanup function to delete the zip file
        await safeUnlink(result.zipPath);
        //we must delete the generated jpg files as well
        await safeRemoveDir(job.payload.outputPath);
        //deleting the uploaded pdf as well
        await safeUnlink(file.path);
      });
    },
  );

  //Feature Three: Pdf compression
  const compressPdf = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length !== 1) {
        return next(new AppError("Please upload a pdf file", 400));
      }

      const quality = req.body.quality as any;
      const allowed = ["screen", "ebook", "printer"];
      if (!allowed.includes(quality)) {
        return next(
          new AppError(
            `Invalid quality value. Allowed values are ${allowed.join(",")}`,
            400,
          ),
        );
      }

      const file = files[0];

      if (!file?.originalname.endsWith(".pdf")) {
        return next(new AppError("Please upload a valid pdf file", 400));
      }

      const job = buildCompressPdfJob(
        {
          path: file.path,
          orginalname: file.originalname,
        },
        quality,
      );

      const result = await workerPool.executeJob<
        typeof job.payload,
        { outputPath: string }
      >(job);

      res.download(result.outputPath, "compressed.pdf", async () => {
        await safeUnlink(result.outputPath);
        await safeUnlink(file.path);
      });
    },
  );

  //Feature Four: Word to Pdf
  const wordToPdf = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const files = req.files as Express.Multer.File[] | undefined;

      if (!files || files.length !== 1) {
        return next(new AppError("Please upload a word document", 400));
      }
      const file = files[0];

      const extension = file?.originalname.toLowerCase();

      if (!extension?.endsWith(".doc") && !extension?.endsWith(".docx")) {
        return next(
          new AppError("Only .doc or .docx files are supported", 400),
        );
      }

      if (!file) {
        return next(
          new AppError("File not found upload .doc or .docx files", 400),
        );
      }

      const job = buildWordToPdfJob({
        path: file.path,
        orginalname: file.originalname,
      });

      const result = await workerPool.executeJob<
        typeof job.payload,
        { outputPath: string }
      >(job);

      res.download(
        result.outputPath,
        path.basename(result.outputPath),
        async () => {
          await safeUnlink(result.outputPath);
          await safeRemoveDir(job.payload.outputDir);
          await safeUnlink(file.path);
        },
      );
    },
  );

  return { jpgtoPdf, pdfToJpg, compressPdf, wordToPdf };
}
