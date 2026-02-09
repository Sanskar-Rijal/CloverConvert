import run from "../../utils/Run.js";
import { CompressPdfPayload } from "../../services/fileService.js";
import AppError from "../../utils/AppError.js";

export async function compressPdf(
  payload: CompressPdfPayload,
): Promise<{ outputPath: string }> {
  const args = [
    "-sDEVICE=pdfwrite",
    "-dCompatibilityLevel=1.4",
    `-dPDFSETTINGS=/${payload.quality}`,
    "-dNOPAUSE",
    "-dQUIET",
    "-dBATCH",
    `-sOutputFile=${payload.outputPath}`,
    payload.inputPath,
  ];

  try {
    await run("gs", args);
  } catch (error) {
    const message = (error as Error).message || String(error);
    throw new AppError(`PDF compression failed: ${message}`, 500);
  }

  return { outputPath: payload.outputPath };
}
