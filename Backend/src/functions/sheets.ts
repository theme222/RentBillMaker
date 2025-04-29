import { google } from "googleapis";
import { type GoogleAuth } from "googleapis-common";

export let auth: GoogleAuth;
export let authClient: any;
export let sheets: any;

function HandleGoogleError(error: any) {
  console.error(`Recieved error from google :`);
  throw error;
}

export function GenSheetId(name: string) {
  // djb2 hash (idk what this one is)
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) + hash + name.charCodeAt(i);
  }
  return (hash >>> 0) % 1e9;
}

export async function StartAPI() {
  console.log("Starting google API");
  auth = new google.auth.GoogleAuth({
    keyFile: ".env.sheets_key.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  authClient = await auth.getClient().catch(HandleGoogleError);
  sheets = google.sheets({ version: "v4", auth: authClient });
}

export async function CheckSheetIdExists(sheetId: number): Promise<boolean> {
  console.log("Requesting ID check ", sheetId);
  const res = await sheets.spreadsheets
    .get({
      spreadsheetId: process.env.SPREADSHEET_ID,
    })
    .catch(HandleGoogleError);

  return res.data.sheets.some(
    (sheet: any) => sheet.properties.sheetId == sheetId,
  );
}

export async function LoadSheet(sheet: string) {
  console.log("Loading Sheet: ", sheet);

  if (!(await CheckSheetIdExists(GenSheetId(sheet))))
    await CreateNewSheet(sheet);

  return await sheets.spreadsheets.values
    .get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: sheet,
    })
    .catch(HandleGoogleError);
}

export async function WriteSheet(valuesToWrite: any[][], sheet: string) {
  console.log(`Writing sheet ${sheet}`);

  if (!(await CheckSheetIdExists(GenSheetId(sheet))))
    await CreateNewSheet(sheet);

  const resource = {
    range: sheet,
    values: valuesToWrite,
  };

  return await sheets.spreadsheets.values
    .update({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: sheet,
      valueInputOption: "RAW",
      resource: resource,
    })
    .catch(HandleGoogleError);
}

export async function CreateNewSheet(sheet: string) {
  console.log("Creating new sheet with name: " + sheet);
  let spreadsheetId: string = process.env.SPREADSHEET_ID as string;
  const batchRequest = {
    spreadsheetId: spreadsheetId,
    requestBody: {
      requests: [
        {
          duplicateSheet: {
            sourceSheetId: 0, // Template sheet id
            newSheetId: GenSheetId(sheet),
            newSheetName: sheet,
          },
        },
      ],
    },
  };
  return await sheets.spreadsheets
    .batchUpdate(batchRequest)
    .catch(HandleGoogleError);
}
