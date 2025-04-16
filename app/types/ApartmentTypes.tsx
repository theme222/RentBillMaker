
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
