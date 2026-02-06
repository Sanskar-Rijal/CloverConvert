//in ESM we can't just use __dirname or __filename directly so we import these two and
//create __dirname and __filename manually
import path from "node:path";
import { fileURLToPath } from "node:url";

//Recreating __filename and __dirname in ESM
//import.meta.url gives the URL of the current file, example:file:///Users/sanskar/project/src/utils/constants.js
//fileURLToPath converts that URL to a normal file path, example:/Users/sanskar/project/src/utils/constants.js
const __filename = fileURLToPath(import.meta.url);
//path.dirname removes the file name, example:/Users/sanskar/project/src/utils
const __dirname = path.dirname(__filename);

//So it becomes
/*
__filename = /project/src/utils/constants.js
__dirname  = /project/src/utils
..        = /project/src
*/

//our Uploads and Output folder will live inside src folder
//so root of our project is ../Backend/src
export const SRC_ROOT = path.resolve(__dirname, "..");

//Temporarily store files when user uploads them
export const UPLOAD_DIR = path.resolve(SRC_ROOT, "uploads");
//Temporarily store files after processing finishes;
export const OUTPUT_DIR = path.resolve(SRC_ROOT, "output");

//Define limits
export const MAX_FILE_MB = Number(process.env.MAX_FILE_MB || 100);
export const MAX_IMAGES_PER_REQUEST = Number(
  process.env.MAX_IMAGES_PER_REQUEST || 30,
);
