export class Apartment
{
  roomName: string = "";
  name: string = "";
  electricity: number = 0;
  water: number = 0;
  miscellaneous?: {[key: string]: number};
  
  constructor(roomName?: string, name?: string, electricity?: number, water?: number, miscellaneous?: {[key: string]: number})
  {
    if (roomName) this.roomName = roomName;
    if (name) this.name = name;
    if (electricity) this.electricity = electricity;
    if (water) this.water = water;
    if (miscellaneous) this.miscellaneous = miscellaneous;
  }
  
  public static LoadFromList(list: (string | number)[]): Apartment
  {
    // List: [roomName(0), name(1), electricity(2), water(3), miscellaneous(4)]
    if (list[2]) list[2] = Number(list[2]);
    if (list[3]) list[3] = Number(list[3]);
    if (list[4]) list[4] = JSON.parse(list[4] as string);
    // @ts-ignore
    return Apartment(...list);
  }
  
  public static LoadSheetData(list: string[][]): Apartment[]
  {
    const apartmentList: Apartment[] = [];
    for (let item of list)
      apartmentList.push(Apartment.LoadFromList(item));
    return apartmentList;
  }
  
}


