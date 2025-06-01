import express, { NextFunction, Request, Response } from "express";
import { Apartment, GlobalFees, WriteApartmentSheet } from "../types/apartment";
import {
  LoadApartment,
  WriteApartment,
  LoadGlobalFees,
  WriteGlobalFees
} from "../functions/sql"
import { thaiMonths } from "../types/dates";

const router = express.Router();
export default router;

async function UpdateRentList(req: Request, res: Response) {
  /*
  * {
     rentList: [{[key: string]: string | number | undefined}],
     globalFees: {}
  * }
  */
  const data = req.body;

  if (!data || !data.apartmentList || !data.globalFees) {
    res.status(400).send("Data not found");
    return;
  }

  const apartmentList = Apartment.ApartmentListFromRentList(data.apartmentList);

  GlobalFees.LoadFromObject(data.globalFees);
  await WriteApartment(apartmentList);
  await WriteGlobalFees();

  res.status(200).send("Success");
}

router.post("/update", UpdateRentList);

async function GetRentList(req: Request, res: Response) {
  /*
   * query:
   *   monthYear: "month(thai) year(buddhist)"
   * returns:
   *  apartmentList:
   *  globalFees
   */
  const data: string = req.query.monthYear as string; // monthYear

  if (!data) {
    res.status(400).send("Invalid query parameters");
    return;
  }

  let sqlData = await LoadApartment(data);
  GlobalFees.LoadMonthYear(data);

  res.status(200).json({
    apartmentList: Apartment.ApartmentListFromSQL(sqlData),
    globalFees: await LoadGlobalFees(),
  });
}

router.get("/get", GetRentList);


async function GetBillList(req: Request, res: Response) {
  /*
   * query:
   *   monthYear: "month(thai) year(buddhist)"
   * returns:
  *    a list of apartment objects that contain the difference between the previous month and the current month
  */

  const currentMonthYear: string = req.query.monthYear as string;

  if (!currentMonthYear) {
    res.status(400).send("Invalid query parameters");
    return;
  }

  // Get current and previous month
  let [month, year] = currentMonthYear.split(" ");
  let prevMonth = thaiMonths[thaiMonths.indexOf(month) - 1];
  let prevYear = year;
  if (prevMonth === undefined){
    prevMonth = thaiMonths[11];
    prevYear = String(Number(year) - 1)
  }
  let prevMonthYear = `${prevMonth} ${prevYear}`;

  let currentData = await LoadApartment(currentMonthYear);
  const currentApartmentList: Apartment[] = Apartment.ApartmentListFromSQL(currentData);
  // Load most recent global fees
  GlobalFees.LoadMonthYear(currentMonthYear);
  GlobalFees.LoadFromObject(await LoadGlobalFees());

  let prevData = await LoadApartment(prevMonthYear);
  const prevApartmentList: Apartment[] = Apartment.ApartmentListFromSQL(currentData);

  const billList = Apartment.ExportBillList(prevApartmentList, currentApartmentList);
  res.status(200).json({
    billList: billList,
    globalFees: GlobalFees.DumpToObject(),
  });
}

router.get("/bill", GetBillList);
