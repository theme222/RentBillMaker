import express, {NextFunction, Request, Response} from "express";
import "dotenv/config";
import { LoadApartment, WriteApartment } from "../functions/sql";
import {Apartment} from "../types/apartment";

const router = express.Router();
export default router;

async function test1(req: Request, res: Response)
{
  const sheetData= await LoadSheet("Template");
  let apartmentList = Apartment.LoadSheetData(sheetData.data.values);
  console.log(apartmentList)
  res.send(sheetData);
}
router.get("/1", test1);


function test2(req: Request, res: Response)
{
  res.send("Hello World");
}

router.get("/2", test2);


function test3(req: Request, res: Response)
{
  res.send("Hello World");
}

router.get("/3", test3);


function Ping(req: Request, res: Response)
{
  console.log(req.body)
  res.json(req.body);
}

router.post("/ping", Ping);
