import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { prepareStorage } from "./services/fileService.js";
import { ensureDirectoryExists } from "./utils/fileUtils.js";
import { OUTPUT_DIR, UPLOAD_DIR } from "./utils/constants.js";
import { WorkerPool } from "./workers/pool/workerPool.js";
import { getWorkerCount } from "./config/worker.config.js";
import { buildRoutes } from "./api/routes.js";
import AppError from "./utils/AppError.js";
import globalErrorHandler from "./api/controllers/errorController.js";

//App entry Point
async function main() {
  const app = express();
  //Basic middleware to parse json
  app.use(express.json());

  const allowedOrigins = [
    "http://localhost:5173",
    "https://cloverconvert.duckdns.org",
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      exposedHeaders: ["Content-Disposition"],
    }),
  );

  //implementing rate limiting
  const limiter = rateLimit({
    limit: 60,
    windowMs: 15 * 60 * 1000, //this will allow 60 request from the same ip in 15 min
    //once limit is crosses we can send error message
    message:
      "Too many request from the same IP, please try again after sometime!!",
  });

  app.use(limiter);

  app.use("/api", limiter); // this will apply for all route that starts with /api
  //prepare folder
  await prepareStorage();

  await ensureDirectoryExists(UPLOAD_DIR);
  await ensureDirectoryExists(OUTPUT_DIR);

  const workerPool = new WorkerPool({ size: getWorkerCount() });
  workerPool.start();

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to CloverConert API",
    });
  });

  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "Okeeyy all good",
    });
  });

  //now routes for converting or compressing files
  app.use("/api/v1/files", buildRoutes({ workerPool: workerPool }));

  //if none of the routes matches then
  app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  //making error handling middleware which can be used anywhere in the app
  app.use(globalErrorHandler);

  const port = process.env.PORT || 9000;
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  process.on("SIGINT", () => {
    server.close(() => workerPool.shutdown());
  });
}

main().catch((err) => {
  console.error("Error starting the server:", err);
  process.exit(1);
});
