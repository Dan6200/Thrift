import { fileURLToPath } from "url";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 1024;

let server: () => void = () => {
  try {
    if (process.argv[1] === fileURLToPath(import.meta.url))
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
      });
  } catch (error) {
    console.error(error);
  }
};

server();
