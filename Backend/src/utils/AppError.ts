//Operational errors are the errors caused by the clients,
//those errors are safe to display to the users.
export default class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    //fail means client error
    //error means internal server error
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); //it will create a stack and trace where the error is
  }
}
