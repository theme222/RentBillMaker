import sqlite3  from "sqlite3";
import { Database, open } from "sqlite";
import { apartmentNames, GlobalFees, Apartment } from "../types/apartment";
import { throwDeprecation } from "node:process";

const DBFILE = "src/database/apartments.db";

export async function InitializeDatabase(): Promise<Database> {
  const DB = await open({
    filename: DBFILE,
    driver: sqlite3.Database
  })
  await DB.run("BEGIN TRANSACTION");
  return DB;
}

export async function CommitDatabase(DB: Database) {
  await DB.run("COMMIT");
  await DB.close()
}

export async function TableExists(tableName: string): Promise<boolean> {
  let DB = await InitializeDatabase();
  const row = await DB.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name = ?`,
    [tableName]
  );
  await CommitDatabase(DB);
  return !!row;
}

export async function CreateTable(sheetName: string) {
  let DB = await InitializeDatabase();

  await DB.run(`CREATE TABLE IF NOT EXISTS "${sheetName}" (
    roomName TEXT NOT NULL PRIMARY KEY,
    name TEXT DEFAULT "",
    electricity INTEGER DEFAULT 0,
    water INTEGER DEFAULT 0,
    miscellaneous TEXT DEFAULT ""
  )`);

  for (let roomName of apartmentNames) {
    await DB.run(`INSERT INTO "${sheetName}" (roomName) VALUES (?)`, roomName);
  }

  await CommitDatabase(DB);
}

export async function LoadApartment(sheetName: string) {
  console.log("Loading");
  await CreateTable(sheetName); // This will create it if it doesn't exist

  let DB = await InitializeDatabase();
  const rows = await DB.all(`SELECT * FROM "${sheetName}"`);
  await CommitDatabase(DB);

  console.log(rows)

  return rows;

}

export async function WriteApartment(apartmentList: Apartment[]) {
  const sheetName = GlobalFees.GetMonthYear()

  // This function full clears and rewrites everything
  let DB = await InitializeDatabase();
  try {
    await CreateTable(sheetName);
    await DB.run(`DELETE FROM "${sheetName}" WHERE true`);

    for (let apartment of apartmentList)
    {
      console.log(apartment);
      await DB.run(`INSERT INTO "${sheetName}" (roomName, name, electricity, water, miscellaneous) VALUES (?, ?, ?, ?, ?)`, ...apartment.DumpToList());
    }
    await CommitDatabase(DB);
  }
  catch (e) {
    await DB.run("ROLLBACK");
    await DB.close();
  }
}

export async function LoadGlobalFees()
{
  let DB = await InitializeDatabase();
  let globalFeesData = await DB.get(`SELECT * FROM GlobalFees WHERE currentMonth = ? AND currentYear = ?`, GlobalFees.currentMonth, GlobalFees.currentYear);

  // Specific monthyear has not been initialized
  if (globalFeesData == null) {
    await DB.run(`INSERT INTO GlobalFees (currentMonth, currentYear) VALUES (?, ?)`, GlobalFees.currentMonth, GlobalFees.currentYear);
    globalFeesData = await DB.get(`SELECT * FROM GlobalFees WHERE currentMonth = ? AND currentYear = ?`, GlobalFees.currentMonth, GlobalFees.currentYear);
  }

  CommitDatabase(DB);

  return globalFeesData
}

export async function WriteGlobalFees()
{
  let DB = await InitializeDatabase();

  try {
    DB.run(`UPDATE GlobalFees SET rent = ?, serviceFee = ?, wasteFee = ?, safetyFee = ?, electricityPerUnit = ?, waterPerUnit = ? WHERE currentMonth = ? AND currentYear = ?`, ...GlobalFees.DumpToList(), GlobalFees.currentMonth, GlobalFees.currentYear)

    await CommitDatabase(DB);
  }
  catch (e) {
    await DB.run("ROLLBACK");
    await DB.close();
  }
}
