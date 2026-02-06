import AppError from "../utils/AppError.js";

//Check whether user uploaded a file or not
export function checkFiles(
  file: unknown,
  message: string = "No file uploaded",
): void {
     //Check if file is an array and has at least one element, if Not throw error
    if( !Array.isArray(file) || file.length === 0){
        throw new AppError(message,400);
    }
}
