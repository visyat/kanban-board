import express from "express";
// import dotenv from "dotenv";

// import mongoose from "mongoose"
import cookieParser from "cookie-parser";

import http from "http";
import path from "path";

import updater from "./lib/server/updater.js";

const PORT = process.env.PORT || 1930;

const app = express();
const server = http.createServer(app);
app.use(cookieParser());

const dirname = process.cwd();
const publicPath = path.join(dirname, "public");
console.log(`Serving files from ${publicPath}`);

app.use("/lib/client", express.static(path.join(dirname, "lib", "client")));
app.use(express.static(publicPath));
updater(server, publicPath);

// dotenv.config()
const start = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server started. Now open http://localhost:${PORT}/ in your browser.`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();
