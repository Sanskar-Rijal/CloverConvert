import fs from "node:fs/promises";
import { spawn } from "node:child_process";
import fsSync from "node:fs";
import archiver from "archiver";
import { PdfToJpg } from "../../services/fileService.js";
import { ensureDirectoryExists } from "../../utils/fileUtils.js";
import AppError from "../../utils/AppError.js";
import path from "node:path";
import run from "../../utils/Run.js";

//function to convert any folder on disk to zip file
async function zipDirectory(sourceDir: string, zipPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    //creating empty zip file, data written to this will be inside zip file
    const output = fsSync.createWriteStream(zipPath);
    const archive = archiver("zip", {
      zlib: {
        level: 9, //compresssion level, 9 means maximum compression
      },
    });

    //resolves when all data is written into the zip file
    output.on("close", resolve);
    archive.on("error", reject);

    archive.pipe(output); //zip the data produced by archive
    archive.directory(sourceDir, false); //take all files from sourceDir and add to zip file,
    //false means we don't want to include the directory itself in the zip
    archive.finalize(); //this means no more files will be added start the compression
  });
}

//Actual function to convert pdf to jpg then zip files
export async function pdfToJpg(
  payload: PdfToJpg,
): Promise<{ zipPath: string }> {
  //ensure output directory exists if not then let's create one
  await ensureDirectoryExists(payload.outputPath);

  //Using a prefix inside outputDir (pdftoppm appends "-1", "-2"...)
  //page-1.jpg, page-2.jpg, page-3.jpg etc
  const prefix = path.join(payload.outputPath, "page");

  //building arguments for pdftoppm command
  const args = ["-jpeg", "-r", String(payload.dpi), payload.inputPath, prefix];

  //converting pdf to jpg using pdftoppm command linetool
  try {
    await run("pdftoppm", args);
  } catch (error) {
    // If pdftoppm is missing, macOS will throw ENOENT here.
    const msg = (error as Error).message || String(error);
    throw new AppError(`PDF to JPG failed: ${msg}`, 500);
  }
  //reading generated jpg files from disk
  const files = await fs.readdir(payload.outputPath);
  //filtering jpg images
  const finalImages = files.filter((f) => f.endsWith(".jpg"));

  if (finalImages.length === 0) {
    throw new AppError("PDF to JPG failed: No images were generated", 500);
  }
  //now lets zip the generated images into a single zip file
  await zipDirectory(payload.outputPath, payload.zipPath);

  return { zipPath: payload.zipPath };
}
