import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

import { StartAPI, sheets, CreateNewSheet } from "./functions/sheets";

import testRouter from "./routes/test";
import apiRouter from "./routes/api";

const app = express();

app.use(cors());

StartAPI().then(() => {});

function RequestLogger(req: Request, res: Response, next: NextFunction) {
  console.log(
    `Receiving ${req.method} request to ${req.path} with body ${req.body}`,
  );
  next();
}

app.use(RequestLogger);

app.use(express.json());

function Main(req: Request, res: Response) {
  res.send("The server is running");
}

app.get("/", Main);

app.use("/test/", testRouter);
app.use("/api", apiRouter);
app.listen(Number(process.env.SERVER_PORT), "::", () =>
  console.log(
    `\nServer is running on http://localhost:${process.env.SERVER_PORT}\n`,
  ),
);
