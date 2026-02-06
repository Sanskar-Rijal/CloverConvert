import fs from "node:fs/promises"; //allows us to work with file using async await
import path from "node:path";

//Before we save any file, we must ensure that the folder exists, it not let's create one
export async function ensureDirectoryExists(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, {
    recursive: true, ///src/uploads/pdf/2026/ even if uploads and pdf doesn't exists it will create one.
  });
}

//After sending the file to user we can delete it from our server
export async function safeUnlink(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Error deleting file ${filePath}:`, err);
  }
}

//Generating file names for upload
export function makeSafeFileName(orginalName: string): string {
  const extension = path.extname(orginalName); //extract .jpg or pdf from file name
  const randomName = Math.floor(Math.random() * 1e9).toString(); //generate random number and convert to string
  return `${Date.now()}-${randomName}${extension}`;
}
