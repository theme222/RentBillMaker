import { google } from "googleapis";
import { type GoogleAuth } from "googleapis-common"

export let auth: GoogleAuth;
export let authClient: any;
export let sheets: any;

export async function StartAPI()
{
  auth = new google.auth.GoogleAuth({
    keyFile: ".env.sheets_key.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });
  
  authClient = await auth.getClient();
  sheets = google.sheets({version: "v4", auth: authClient});
}
