export class GlobalFees 
{
  public static rent: number = 1200;
  public static serviceFee: number = 750;
  public static wasteFee: number = 40;
  public static electricityPerUnit: number = 9;
  public static waterPerUnit: number = 35;

  public static Sync()
  {
    localStorage.setItem("priceValues", JSON.stringify(this));
  }

  public static Load()
  {
    const loaded = localStorage.getItem("priceValues");
    if (loaded) 
    {
      const parsed = JSON.parse(loaded);
      this.rent = parsed.rent;
      this.serviceFee = parsed.serviceFee;
      this.wasteFee = parsed.wasteFee;
      this.electricityPerUnit = parsed.electricityPerUnit;
      this.waterPerUnit = parsed.waterPerUnit;
    }
  }

  public static GetState(): PriceValues_t
  {
    return {
      "ค่าเช่า": this.rent,
      "ค่าบริการส่วนกลาง": this.serviceFee,
      "ค่าจัดการขยะมูลฝอย": this.wasteFee,
      "ราคาไฟฟ้า (ต่อ unit)": this.electricityPerUnit,
      "ราคาน้ำ (ต่อ unit)": this.waterPerUnit
    };
  }
}

export class Apartment
{
  roomName: string = "";
  name: string = "";
  electricity: number = 0;
  water: number = 0;
  miscillaneous?: {[key: string]: number};

  constructor(roomName?: string, name?: string, electricity?: number, water?: number, miscillaneous?: {[key: string]: number})
  {
    if (roomName) this.roomName = roomName;
    if (name) this.name = name;
    if (electricity) this.electricity = electricity;
    if (water) this.water = water;
    if (miscillaneous) this.miscillaneous = miscillaneous;
  }

  public static Load(obj: any): Apartment
  {
    const apartment = new Apartment(obj.roomName, obj.name, obj.electricity, obj.water, obj.miscillaneous);
    return apartment 
  }

  GetProperty(key: string): number | string | null 
  {
    if (key === "electricity") return this.electricity;
    else if (key === "water") return this.water;
    else if (key === "roomName") return this.roomName;
    else if (key === "name") return this.name;
    else return null;
  }

  SetProperty(key: string, value: number | string)
  {
    if (key === "electricity") this.electricity = value as number;
    else if (key === "water") this.water = value as number;
    else if (key === "roomName") this.roomName = value as string;
    else if (key === "name") this.name = value as string;
    else console.error("Invalid property key: " + key);
  }

  public static LoadFromRentList(obj: any): {[key: string]: Apartment}
  {
    // Insert a list of objects that may have the same fields as this class and it will add the methods associated and strip away any other properties
    const rentList: {[key: string]: Apartment} = {};
    for (const key in obj) 
    {
      if (obj.hasOwnProperty(key)) 
      {
        const apartment = Apartment.Load(obj[key]);
        apartment.roomName = key;
        rentList[key] = apartment;
      }
    }
    return rentList;
  }
}



export interface Apartment_t
{
  "ค่าไฟฟ้า": number;
  "ค่าน้ำประปา": number;
  "นาม": string;
  
  [key: string]: number | string;
}

export interface PriceValues_t
{
  "ค่าเช่า": number;
  "ค่าบริการส่วนกลาง": number;
  "ค่าจัดการขยะมูลฝอย": number;
  "ราคาไฟฟ้า (ต่อ unit)": number;
  "ราคาน้ำ (ต่อ unit)": number;
  
  [key: string]: number;
}

export const apartmentBuildings: string[] = ["A", "B"];
export const apartmentFloors: string[] = ["1", "2", "3"];
export const apartmentNumbers: string[] = [
  "01", "02", "03", "04", "05", "06", "07",
  "08", "09", "10", "11", "12", "13", "14",
  "15", "16", "17", "18", "19", "20", "21"
]; // I don't want to hear any complaints

export const apartmentNames: string[] = [];
for (let building of apartmentBuildings)
  for (let floor of apartmentFloors)
    for (let num of apartmentNumbers)
      apartmentNames.push(building + floor + num); // Yes.
