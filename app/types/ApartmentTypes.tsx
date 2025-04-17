class GlobalFees 
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
}

class Apartment
{
  roomName: string = "";
  name: string = "";
  electricity: number = 0;
  water: number = 0;
  miscillaneous?: {[key: string]: number};

  constructor( roomName?: string, name?: string, electricity?: number, water?: number, miscillaneous?: {[key: string]: number})
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
