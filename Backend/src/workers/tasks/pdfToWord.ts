import { PdfToWordPayload } from "../../services/fileService.js";
import AppError from "../../utils/AppError.js";
import { ensureDirectoryExists } from "../../utils/fileUtils.js";
import fs from "node:fs/promises";
import run from "../../utils/Run.js";
import path from "node:path";

export async function pdfToWord(
  payload: PdfToWordPayload,
): Promise<{ outputPath: string }> {
  //let's ensure output directory exists
  await ensureDirectoryExists(payload.outputDir);

  const args = ["-m", "pdf2docx", payload.inputPath, payload.outputDir];

  try {
    await run("python3", args);
  } catch (error) {
    const message = (error as Error).message || String(error);
    throw new AppError(`PDF to Word conversion failed: ${message}`, 500);
  }

  const files = await fs.readdir(payload.outputDir);
  const docx = files.find((f) => f.endsWith(".docx"));

  if (!docx) {
    throw new AppError(
      "PDF to Word conversion failed: No output file generated",
      500,
    );
  }

  return { outputPath: path.join(payload.outputDir, docx) };
}
