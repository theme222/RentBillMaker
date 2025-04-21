import express, {NextFunction, Request, Response} from "express";
import "dotenv/config";
import { google } from "googleapis";

const app = express();

function RequestLogger(req: Request, res: Response, next: NextFunction)
{
  console.log(`Receiving ${req.method} request to ${req.path} with body ${JSON.stringify(req.body)}`);
  next();
}
app.use(RequestLogger)

function Ping(req: Request, res: Response)
{
  res.send(`You sent ${String(req.body)}`);
}
app.get("/ping", Ping);

function Main(req: Request, res: Response,)
{
  res.send("The server is running");
}
app.get("/", Main)

app.listen(Number(process.env.SERVER_PORT), "::", () => console.log(`\nServer is running on http://localhost:${process.env.SERVER_PORT}\n`));