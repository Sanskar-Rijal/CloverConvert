import fs from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { JpgToPdfPayLoad } from "../../services/fileService.js";
import path from "node:path";

export async function jpgToPdf(
  payload: JpgToPdfPayLoad,
): Promise<{ outputPath: string }> {
  //Creating an empty pdf
  const pdf = await PDFDocument.create();
  //now we loop through each images saved at inputPaths and then add them to the pdf
  for (const imagePath of payload.inputPaths) {
    //Read the image file as bytes from the disk and load it into the memory
    const bytes = await fs.readFile(imagePath);
    //Detecting the image type
    const extension = path.extname(imagePath).toLowerCase();

    let embedded;
    //now we embed the image into the memory then later we draw it on the page
    if (extension === ".jpg" || extension === ".jpeg") {
      embedded = await pdf.embedJpg(bytes);
    } else if (extension === ".png") {
      embedded = await pdf.embedPng(bytes);
    } else {
      throw new Error(`Unsupported image type: ${extension}`);
    }
    //matching page size to image size
    const { width, height } = embedded.size();
    const page = pdf.addPage([width, height]);

    //drawing the image on the page
    page.drawImage(embedded, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }
  //now we have the pdf ready in memory, we can save it to the disk at outputPath
  const out = await pdf.save();
  await fs.writeFile(payload.outputPath, out); //writing the bytes(pdf) to the disk

  return { outputPath: payload.outputPath };
}
