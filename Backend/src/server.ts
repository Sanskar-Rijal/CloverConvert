import "dotenv/config";
import express from "express";

//App entry Point
async function main() {
  const app = express();
  const port = process.env.PORT || 9000;
  const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((err) => {
  console.error("Error starting the server:", err);
  process.exit(1);
});
