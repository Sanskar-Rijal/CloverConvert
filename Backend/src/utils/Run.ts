import { spawn } from "node:child_process";

export default function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    //spawn is used to start another program
    //spawn(command, args, options)
    //command- Program to run pdftoppm
    //args - array of arguments to pass to the command
    //options- how i/p o/p is handled
    const child = spawn(command, args, { stdio: ["ignore", "ignore", "pipe"] });
    //stdio has 3 channels - stdin, stdout, stderr. We ignore stdin and stdout but we listen to stderr to catch any errors

    //if the command fails we capture error message
    let stderr = "";
    child.stderr.on("data", (data) => (stderr += data.toString()));

    //handling startup errors
    child.on("error", reject);
    //when the command exists code===0 success otherwise failure
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });
  });
}
