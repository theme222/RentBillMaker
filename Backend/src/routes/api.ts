import express, { NextFunction, Request, Response } from "express";
import { Apartment, GlobalFees, WriteApartmentSheet } from "../types/apartment";
import {
  CheckSheetIdExists,
  GenSheetId,
  LoadSheet,
  sheets,
} from "../functions/sheets";

const router = express.Router();
export default router;

async function UpdateRentList(req: Request, res: Response) {
  /*
  * {
     rentList: [{[key: string]: string | number | undefined}],
     globalFees: {}
  * }
  */
  const data = req.body; //

  if (!data || !data.rentList || !data.globalFees) {
    res.status(400).send("Data not found");
    return;
  }

  const apartmentList = Apartment.ApartmentListFromRentList(data.rentList);

  GlobalFees.LoadFromObject(data.globalFees);
  const result = await WriteApartmentSheet(apartmentList);
  res.status(200).json(result);
}

router.post("/update", UpdateRentList);

async function GetRentList(req: Request, res: Response) {
  /*
   * query:
   *   monthYear: "month(thai) - year(buddhist)"
   */
  const data: string = req.query.monthYear as string;

  if (!data) {
    res.status(400).send("Invalid query parameters");
    return;
  }

  const sheetData = (await LoadSheet(data)).data.values;

  const apartmentList: Apartment[] = Apartment.LoadSheetData(
    sheetData.slice(0, sheetData.length - 1),
  );
  GlobalFees.LoadFromSheet(sheetData[sheetData.length - 1]);
  res.status(200).json({
    apartmentList: apartmentList,
    globalFees: GlobalFees.DumpToObject(),
  });
}

router.get("/get", GetRentList);
