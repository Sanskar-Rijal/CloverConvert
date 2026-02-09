import fs from "node:fs/promises";
import { WordToPdfPayload } from "../../services/fileService.js";
import AppError from "../../utils/AppError.js";
import { ensureDirectoryExists } from "../../utils/fileUtils.js";
import run from "../../utils/Run.js";
import path from "node:path";

export default async function wordToPdf(
  payload: WordToPdfPayload,
): Promise<{ outputPath: string }> {
  const SOFFICE = "/Applications/LibreOffice.app/Contents/MacOS/soffice";

  //let's ensure output directory exists
  await ensureDirectoryExists(payload.outputDir);

  const args = [
    "--headless",
    "--convert-to",
    "pdf",
    "--outdir",
    payload.outputDir,
    payload.inputPath,
  ];

  try {
    await run(SOFFICE, args);
  } catch (error) {
    const message = (error as Error).message || String(error);
    throw new AppError(`Word to PDF conversion failed: ${message}`, 500);
  }

  const files = await fs.readdir(payload.outputDir);
  const requiredpdf = files.find((f) => f.endsWith(".pdf"));
  if (!requiredpdf) {
    throw new AppError("Word → PDF failed: no output file generated", 500);
  }

  return { outputPath: path.join(payload.outputDir, requiredpdf) };
}
