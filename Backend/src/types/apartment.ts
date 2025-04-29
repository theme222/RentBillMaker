import { WriteSheet } from "../functions/sheets";

export class Apartment {
  roomName: string = "";
  name: string = "";
  electricity: number = 0;
  water: number = 0;
  miscellaneous?: { [key: string]: number };

  constructor(
    roomName?: string,
    name?: string,
    electricity?: number,
    water?: number,
    miscellaneous?: { [key: string]: number },
  ) {
    if (roomName) this.roomName = roomName;
    if (name) this.name = name;
    if (electricity) this.electricity = electricity;
    if (water) this.water = water;
    if (miscellaneous) this.miscellaneous = miscellaneous;
  }

  public static LoadFromObject(obj: any): Apartment {
    // @ts-ignore
    return new Apartment(...Object.values(obj));
  }

  public static LoadFromList(list: any[]): Apartment {
    // List: [roomName(0), name(1), electricity(2), water(3), miscellaneous(4)]
    if (list[2]) list[2] = Number(list[2]);
    if (list[3]) list[3] = Number(list[3]);
    if (list[4]) list[4] = JSON.parse(list[4] as string);
    return new Apartment(...list);
  }

  public static ApartmentListFromRentList(rentList: {
    [key: string]: Apartment;
  }): Apartment[] {
    return Object.values(rentList);
  }

  public static LoadSheetData(list: any[][]): Apartment[] {
    const apartmentList: Apartment[] = [];
    for (let item of list) apartmentList.push(Apartment.LoadFromList(item));
    return apartmentList;
  }

  public static DumpSheetData(apartmentList: Apartment[]): any[][] {
    const list: any[][] = [];
    for (let apartment of apartmentList)
      list.push([
        apartment.roomName,
        apartment.name,
        apartment.electricity,
        apartment.water,
        JSON.stringify(apartment.miscellaneous) || "",
      ]);
    return list;
  }

  public static ApartmentListToRentList(apartmentList: Apartment[]) {
    const rentList: { [key: string]: Apartment } = {};
    for (let apartment of apartmentList) {
      rentList[apartment.roomName] = apartment;
    }
    return rentList;
  }
}

export async function WriteApartmentSheet(apartmentList: Apartment[]) {
  // Using WriteSheet from sheets.ts
  const sheetData = Apartment.DumpSheetData(apartmentList);
  sheetData.push(GlobalFees.DumpToList());

  const result = await WriteSheet(sheetData, GlobalFees.GetFullDate());
  return result;
}

export const apartmentBuildings: string[] = ["A", "B"];
export const apartmentFloors: string[] = ["1", "2", "3"];
export const apartmentNumbers: string[] = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
]; // I don't want to hear any complaints

export const apartmentNames: string[] = [];
for (let building of apartmentBuildings)
  for (let floor of apartmentFloors)
    for (let num of apartmentNumbers)
      apartmentNames.push(building + floor + num); // Yes.

export class GlobalFees {
  public static rent: number = 1200;
  public static serviceFee: number = 750;
  public static wasteFee: number = 40;
  public static electricityPerUnit: number = 9;
  public static waterPerUnit: number = 35;
  public static currentMonth: string = "มกราคม";
  public static currentYear: number = 0;

  public static LoadFromObject(obj: any) {
    GlobalFees.rent = obj.rent;
    GlobalFees.serviceFee = obj.serviceFee;
    GlobalFees.wasteFee = obj.wasteFee;
    GlobalFees.electricityPerUnit = obj.electricityPerUnit;
    GlobalFees.waterPerUnit = obj.waterPerUnit;
    GlobalFees.currentMonth = obj.currentMonth;
    GlobalFees.currentYear = obj.currentYear;
  }

  public static LoadFromSheet(sheetData: any[]) {
    GlobalFees.rent = Number(sheetData[0]);
    GlobalFees.serviceFee = Number(sheetData[1]);
    GlobalFees.wasteFee = Number(sheetData[2]);
    GlobalFees.electricityPerUnit = Number(sheetData[3]);
    GlobalFees.waterPerUnit = Number(sheetData[4]);
  }

  public static DumpToList(): any[] {
    // Doesn't dump the dates
    return [
      GlobalFees.rent,
      GlobalFees.serviceFee,
      GlobalFees.wasteFee,
      GlobalFees.electricityPerUnit,
      GlobalFees.waterPerUnit,
    ];
  }

  public static DumpToObject(): any {
    return {
      rent: GlobalFees.rent,
      serviceFee: GlobalFees.serviceFee,
      wasteFee: GlobalFees.wasteFee,
      electricityPerUnit: GlobalFees.electricityPerUnit,
      waterPerUnit: GlobalFees.waterPerUnit,
    };
  }

  public static GetFullDate(): string {
    return `${GlobalFees.currentMonth} - ${GlobalFees.currentYear}`;
  }
}
