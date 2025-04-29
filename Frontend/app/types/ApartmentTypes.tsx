import { thaiMonths } from "~/types/DateTypes";
const currentDate = new Date();

export class GlobalFees {
  public static rent: number = 1200;
  public static serviceFee: number = 750;
  public static wasteFee: number = 40;
  public static electricityPerUnit: number = 9;
  public static waterPerUnit: number = 35;
  public static currentMonth: string = thaiMonths[currentDate.getMonth()]; // TODO: Might need to -1 here
  public static currentYear: number = currentDate.getFullYear() + 543;

  public static Sync() {
    localStorage.setItem("priceValues", JSON.stringify(this));
  }

  public static LoadFromObject(obj: any) {
    // Loads global fees from the backend
    this.rent = obj.rent;
    this.serviceFee = obj.serviceFee;
    this.wasteFee = obj.wasteFee;
    this.electricityPerUnit = obj.electricityPerUnit;
    this.waterPerUnit = obj.waterPerUnit;
  }

  public static LoadFromState(obj: any) {
    // Loads global fees from the backend
    this.rent = obj["ค่าเช่า"];
    this.serviceFee = obj["ค่าบริการส่วนกลาง"];
    this.wasteFee = obj["ค่าจัดการขยะมูลฝอย"];
    this.electricityPerUnit = obj["ราคาไฟฟ้า (ต่อ unit)"];
    this.waterPerUnit = obj["ราคาน้ำ (ต่อ unit)"];
    this.currentMonth = obj["เดือน"];
    this.currentYear = obj["ปี"];
  }

  public static Dump() {
    return {
      rent: this.rent,
      serviceFee: this.serviceFee,
      wasteFee: this.wasteFee,
      electricityPerUnit: this.electricityPerUnit,
      waterPerUnit: this.waterPerUnit,
      currentMonth: this.currentMonth,
      currentYear: this.currentYear,
    };
  }

  public static GetMonthYear(): string {
    return `${this.currentMonth} - ${this.currentYear}`;
  }

  public static GetState(): PriceValues_t {
    return {
      ค่าเช่า: this.rent,
      ค่าบริการส่วนกลาง: this.serviceFee,
      ค่าจัดการขยะมูลฝอย: this.wasteFee,
      "ราคาไฟฟ้า (ต่อ unit)": this.electricityPerUnit,
      "ราคาน้ำ (ต่อ unit)": this.waterPerUnit,
      เดือน: this.currentMonth,
      ปี: this.currentYear,
    };
  }
}

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
    miscellaneous?: { [key: string]: number }
  ) {
    if (roomName) this.roomName = roomName;
    if (name) this.name = name;
    if (electricity) this.electricity = electricity;
    if (water) this.water = water;
    if (miscellaneous) this.miscellaneous = miscellaneous;
  }

  public static Load(obj: any): Apartment {
    return new Apartment(
      obj.roomName,
      obj.name,
      obj.electricity,
      obj.water,
      obj.miscellaneous
    );
  }

  GetProperty(key: string): number | string | null {
    if (key === "electricity") return this.electricity;
    else if (key === "water") return this.water;
    else if (key === "roomName") return this.roomName;
    else if (key === "name") return this.name;
    else return null;
  }

  SetProperty(key: string, value: number | string) {
    if (key === "electricity") this.electricity = value as number;
    else if (key === "water") this.water = value as number;
    else if (key === "roomName") this.roomName = value as string;
    else if (key === "name") this.name = value as string;
    else console.error("Invalid property key: " + key);
  }

  public static ApartmentListToRentList(obj: any[]): {
    [key: string]: Apartment;
  } {
    // This is used when loading a list of apartments from the database
    const rentList: { [key: string]: Apartment } = {};
    for (const apartment of obj) {
      const newApartment = Apartment.Load(apartment);
      rentList[newApartment.roomName] = newApartment;
    }
    return rentList;
  }

  public static DumpToRentList(obj: { [key: string]: Apartment }): any[] {
    const rentList: any[] = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        rentList.push(obj[key]);
      }
    }
    return rentList;
  }
}

export interface Apartment_t {
  ค่าไฟฟ้า: number;
  ค่าน้ำประปา: number;
  นาม: string;

  [key: string]: number | string;
}

export interface PriceValues_t {
  ค่าเช่า: number;
  ค่าบริการส่วนกลาง: number;
  ค่าจัดการขยะมูลฝอย: number;
  "ราคาไฟฟ้า (ต่อ unit)": number;
  "ราคาน้ำ (ต่อ unit)": number;
  เดือน: string;
  ปี: number;

  [key: string]: number | string;
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
