import path from "node:path";
import { OUTPUT_DIR } from "../utils/constants.js";
import { ensureDirectoryExists } from "../utils/fileUtils.js";
import { v4 as uuid } from "uuid";

//How uploaded files looks like on disk
export interface DiskFile {
  path: string; //this path is saved by multer
  orginalname: string;
}

export type JobType =
  | "JPG_TO_PDF"
  | "PDF_TO_JPG"
  | "PDF_COMPRESS"
  | "PDF_TO_WORD"
  | "WORD_TO_PDF";

export interface Job<TPayload> {
  id: string;
  type: JobType;
  payload: TPayload;
}

//Feature one : Jpg to pdf

//Jpg to pdf Structure
export interface JpgToPdfPayLoad {
  inputPaths: string[];
  outputPath: string;
}

//ensure that output folder exists before saving the file
export async function prepareStorage(): Promise<void> {
  await ensureDirectoryExists(OUTPUT_DIR);
}

//take uploaded files, build a job object and return it
export function buildJpgToPdfJob(files: DiskFile[]): Job<JpgToPdfPayLoad> {
  //Every job must have a unique id
  const jobId = uuid();
  return {
    id: jobId,
    type: "JPG_TO_PDF",
    payload: {
      inputPaths: files.map((f) => f.path),
      outputPath: path.resolve(OUTPUT_DIR, `${jobId}.pdf`),
    },
  };
}

//Feature two : Pdf to Jpg

export interface PdfToJpg {
  inputPath: string;
  outputPath: string;
  zipPath: string;
  dpi: number;
  //more the dpi higher the quality and size of output images
  //dpi affects both speed and quality
}

export function buildPdftoJpgJob(
  file: DiskFile,
  opts?: { dpi?: number },
): Job<PdfToJpg> {
  const jobId = uuid();
  return {
    id: jobId,
    type: "PDF_TO_JPG",
    payload: {
      inputPath: file.path,
      outputPath: path.resolve(OUTPUT_DIR, jobId),
      zipPath: path.resolve(OUTPUT_DIR, `${jobId}.zip`),
      dpi: opts?.dpi || 300,
    },
  };
}

//Feature three: PDF Compression
export type qualityType = "screen" | "ebook" | "printer";

export interface CompressPdfPayload {
  inputPath: string;
  outputPath: string;
  quality: qualityType;
}

export function buildCompressPdfJob(
  file: DiskFile,
  quality: CompressPdfPayload["quality"] = "ebook",
): Job<CompressPdfPayload> {
  const jobId = uuid();

  return {
    id: jobId,
    type: "PDF_COMPRESS",
    payload: {
      inputPath: file.path,
      outputPath: path.resolve(OUTPUT_DIR, `${jobId}.pdf`),
      quality: quality,
    },
  };
}

//Feature four: Word to Pdf
export interface WordToPdfPayload {
  inputPath: string;
  outputDir: string;
  outputPath: string;
}

export function buildWordToPdfJob(file: DiskFile): Job<WordToPdfPayload> {
  const jobId = uuid();
  const outputDir = path.resolve(OUTPUT_DIR, jobId);
  const outputPath = path.resolve(outputDir, `${jobId}.pdf`);
  return {
    id: jobId,
    type: "WORD_TO_PDF",
    payload: {
      inputPath: file.path,
      outputDir: outputDir,
      outputPath: outputPath,
    },
  };
}
