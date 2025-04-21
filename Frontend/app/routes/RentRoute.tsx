import PageTitle from "~/components/PageTitle";
import GridLayout from "~/components/GridLayout";
import React, {type ReactElement, type ReactNode, useEffect, useState, useContext, createContext} from "react";
import {type Apartment_t, type PriceValues_t, apartmentBuildings, apartmentFloors, apartmentNumbers, apartmentNames, Apartment, GlobalFees} from "~/types/ApartmentTypes";
import { thaiMonths, type MonthYear_t} from "~/types/DateTypes";
import {type ReactState} from "~/types/EsotericReactTypes";
import { EnlgishToThai } from "~/functions/InToOutTranslator";

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear() + 543;

function DateSetter({monthYear, setMonthYear}: {
  monthYear: MonthYear_t,
  setMonthYear: ReactState<MonthYear_t> 
})
{
  
  const HandleMonthChange = (month: string) =>
  {
    const newMonthYear = {...monthYear, month: month};
    setMonthYear(newMonthYear);
    localStorage.setItem("monthYear", JSON.stringify(newMonthYear));
  }
  
  const HandleYearChange = (year: number) =>
  {
    const newMonthYear = {...monthYear, year: year};
    setMonthYear(newMonthYear);
    localStorage.setItem("monthYear", JSON.stringify(newMonthYear));
  }
  
  const monthElement = thaiMonths.map((month) => <option key={month}>{month}</option>);
  const yearElement = Array(15).fill(0).map((_, i) => currentYear + 1 - i)
    .map((year) => <option key={year}>{year}</option>);
  
  return (
    <div className="flex justify-between items-center h-16 w-full px-5">
      <span className="">ประจำเดือน</span>
      <div className="join">
        <select onChange={(e) => HandleMonthChange(e.target.value)}
                className="select select-secondary rounded-md join-item w-25" value={monthYear.month}>
          {monthElement}
        </select>
        <select onChange={(e) => HandleYearChange(Number(e.target.value))}
                className="select select-secondary rounded-md join-item w-20" value={monthYear.year}>
          {yearElement}
        </select>
      </div>
    </div>
  )
}

function ValueSetter({propertyName, value, setValue}: {
  propertyName: string,
  value: PriceValues_t,
  setValue: ReactState<PriceValues_t> 
})
{
  const HandlePriceChange = (newValue: number) =>
  {
    let newPriceValues = {...value, [propertyName]: newValue};

    localStorage.setItem("priceValues", JSON.stringify(newPriceValues));
    setValue(newPriceValues); 
  }
  
  return (
    <div className="flex justify-between items-center h-16 w-full px-5">
      <span className="">{propertyName}</span>
      <label className="input input-success validator w-45">
        <input type="number" className="" min="1" max="9999" onChange={(e) => HandlePriceChange(Number(e.target.value))}
               required value={value[propertyName] || -1}/>
        <span className="label">บาท</span>
      </label>
    </div>
  )
}

function DynamicValueSetter({propertyName, rentList, setRentList, apartmentName} : {propertyName: "water" | "electricity" | "name", rentList: { [key: string]: Apartment }, setRentList: ReactState<{ [key: string]: Apartment }>, apartmentName: string})
{ 
  const [unitAfter, setUnitAfter] = useState<number | string>(0);
  
  const HandleValueChange = (value: string | number) =>
  {
    if (propertyName != "name") value = Number(value);
    const newRentList: { [key: string]: Apartment } = {...rentList};
    if (!newRentList[apartmentName]) newRentList[apartmentName] = new Apartment(apartmentName);
    newRentList[apartmentName].SetProperty(propertyName, value);

    setUnitAfter(value);
    setRentList(newRentList);
    localStorage.setItem("rentList", JSON.stringify(newRentList));
  }
  
  useEffect(() =>
  {
    if (rentList[apartmentName]) 
    {
      setUnitAfter(rentList[apartmentName].GetProperty(propertyName) || "");
    }
    else setUnitAfter(0);
  }, [apartmentName, rentList])
  
  return (
    <div className="flex justify-between items-center h-16 w-full px-5">
      <span className="">{EnlgishToThai[propertyName]}</span>
      <div className="flex items-center">
        <label className="input input-success validator w-40">
          <input type={propertyName != "name" ? "number": "text"} className="" min="0" value={unitAfter} onChange={(e) => HandleValueChange(e.target.value) }/>
          {propertyName != "name" ? <span className="label">Unit</span> : <></>}
        </label>
      </div>
    </div>
  )
}

// TODO: Remove this 
function NameSetter({rentList, setRentList, apartmentName} : {rentList: { [key: string]: Apartment_t }, setRentList: ReactState<{ [key: string]: Apartment_t }>, apartmentName: string})
{
  const [name, setName] = useState<string>("");
  
  const HandleNameChange = (newName: string) =>
  {
    setName(newName);
    let newRentList = {...rentList};
    if (!newRentList[apartmentName])
    {
      newRentList[apartmentName] = {"ค่าไฟฟ้า": 0, "ค่าน้ำประปา": 0, "นาม": "",};
    }
    newRentList[apartmentName]["นาม"] = newName;
    setRentList(newRentList);
    localStorage.setItem("rentList", JSON.stringify(newRentList));
  }
  
  useEffect(() =>
  {
    if (rentList[apartmentName]) setName(rentList[apartmentName]["นาม"]);
    else setName("");
  }, [apartmentName, rentList])
  
  return (
    <div className="flex justify-between items-center h-16 w-full px-5">
      <span className="">นาม</span>
      <div className="flex items-center">
        <input type="text" className="input input-success validator w-40" value={name} onChange={(e) =>
        {
          HandleNameChange(e.target.value);
        }}/>
      </div>
    </div>
  )
}

function Card({children}: { children: ReactNode })
{
  return (
    <div className="w-1/2 bg-base-100 border-2 border-base-200 rounded-md shadow-md h-full">
      {children}
    </div>
  )
}

function Card1Content()
{
  const [priceValues, setPriceValues] = useState<PriceValues_t>(GlobalFees.GetState());
  const [monthYear, setMonthYear] = useState({
    month: thaiMonths[currentMonth],
    year: currentYear
  });
  
  useEffect(() =>
    {
      const interval = setInterval(() =>
      {
        if (localStorage.getItem("priceValues"))
          setPriceValues(JSON.parse(localStorage.getItem("priceValues") as string));
        if (localStorage.getItem("monthYear"))
          setMonthYear(JSON.parse(localStorage.getItem("monthYear") as string));
      }, 1000);
      return () => clearInterval(interval);
    }, []
  )
  
  return (
    <>
      <h1 className="w-full text-2xl flex justify-center items-center h-20 font-semibold">ข้อมูลส่วนรวม</h1>
      <ValueSetter propertyName="ค่าเช่า" value={priceValues} setValue={setPriceValues}/>
      <ValueSetter propertyName="ค่าบริการส่วนกลาง" value={priceValues} setValue={setPriceValues}/>
      <ValueSetter propertyName="ค่าจัดการขยะมูลฝอย" value={priceValues} setValue={setPriceValues}/>
      <ValueSetter propertyName="ราคาไฟฟ้า (ต่อ unit)" value={priceValues} setValue={setPriceValues}/>
      <ValueSetter propertyName="ราคาน้ำ (ต่อ unit)" value={priceValues} setValue={setPriceValues}/>
      <DateSetter monthYear={monthYear} setMonthYear={setMonthYear}/>
    </>
  )
}

function Card2Content({apartmentName, setApartmentName} : { apartmentName: string, setApartmentName: ReactState<string>})
{
  const buildingSelect = apartmentBuildings.map(name => <option key={name}>{name}</option>);
  const floorSelect = apartmentFloors.map(name => <option key={name}>{name}</option>);
  const numberSelect = apartmentNumbers.map(name => <option key={name}>{name}</option>);
  
  const [rentList, setRentList] = useState<{ [key: string]: Apartment }>({});
  const [deleteButton, setDeleteButton] = useState<boolean>(false);
  
  useEffect(() =>
  {
    const interval = setInterval(() =>
    {
      if (localStorage.getItem("rentList"))
        setRentList(Apartment.LoadFromRentList(JSON.parse(localStorage.getItem("rentList") as string)));
    }, 1000);
    return () => clearInterval(interval);
  }, [])
  
  const ClearCurrentApartment = () =>
  {
    const newRentList = {...rentList};
    delete newRentList[apartmentName];
    setRentList(newRentList)
    localStorage.setItem("rentList", JSON.stringify(newRentList));
  }
  
  const ClearAllApartments = () =>
  {
    if (deleteButton)
    {
      setRentList({});
      localStorage.setItem("rentList", JSON.stringify({}));
    }
    setTimeout(() => setDeleteButton(false), 2000)
    setDeleteButton(!deleteButton);
  }
  
  return (
    <>

      <div className="w-full flex justify-center items-center h-20 font-semibold *:text-xl">
        <div className="rounded-md border-2 border-primary bg-white w-62 flex justify-center">
          <span className="text-lg min-w-15 flex items-center justify-center">ห้อง :</span>
          <select className="select select-ghost" value={apartmentName[0]}
                  onChange={(e) => {setApartmentName(e.target.value + apartmentName.slice(1))}}>
            {buildingSelect}
          </select>
          <select className="select select-ghost" value={apartmentName[1]}
                  onChange={(e) => {setApartmentName(apartmentName[0] + e.target.value + apartmentName.slice(2))}}>
            {floorSelect}
          </select>
          <select className="select select-ghost w-20" value={apartmentName.slice(2)}
                  onChange={(e) => {setApartmentName(apartmentName.slice(0, 2) + e.target.value)}}>
            {numberSelect}
          </select>
        </div>
      </div>
      
      <DynamicValueSetter propertyName="name" rentList={rentList} setRentList={setRentList} apartmentName={apartmentName}/>
      <DynamicValueSetter propertyName="electricity" rentList={rentList} setRentList={setRentList} apartmentName={apartmentName}/>
      <DynamicValueSetter propertyName="water" rentList={rentList} setRentList={setRentList} apartmentName={apartmentName}/>

      <div className="w-full flex justify-center items-center h-40 gap-10">
        <button className="btn btn-warning" onClick={ClearCurrentApartment}>เคลียร์ข้อมูลห้องนี้</button>
        <button className="btn btn-error"
                onClick={ClearAllApartments}>{deleteButton ? "กดอีกครั้งเพื่อลบทิ้ง" : "เคลียร์ข้อมูลห้องทั้งหมด"}</button>
        <button className="btn btn-primary" onClick={() => console.log(rentList)}>Print rrentlist</button>
      </div>
    </>
  )
}

function RentTableInfo({setApartmentName} : { setApartmentName: ReactState<string>})
{
  const roomNameElements = apartmentNames.map((e) => <th key={e} className="underline cursor-pointer" onClick={() => setApartmentName(e)}>{e}</th>);
  const [electric, setElectric] = useState<ReactElement[]>([]);
  const [water, setWater] = useState<ReactElement[]>([]);
  const [name, setName] = useState<ReactElement[]>([]);
  
  useEffect(() =>
  {
    let interval = setInterval(() =>
    {
      let newElectric: ReactElement[] = [];
      let newWater: ReactElement[] = [];
      let newName: ReactElement[] = [];
      
      const rentList = Apartment.LoadFromRentList(JSON.parse(localStorage.getItem("rentList") as string));
      for (let name of apartmentNames)
      {
        let currentElectric: number = 0;
        let currentWater: number = 0;
        let currentName: string = "";
        
        if (rentList[name])
        {
          currentElectric = Number(rentList[name].electricity);
          currentWater = Number(rentList[name].water);
          currentName = rentList[name].name;
        }
        
        newElectric.push(<th key={name}
                             className={currentElectric > 0 ? "bg-success" : "bg-error"}>{currentElectric}</th>)
        newWater.push(<th key={name} className={currentWater > 0 ? "bg-success" : "bg-error"}>{currentWater}</th>)
        newName.push(<th key={name} className={currentName.trim() ? "bg-success" : "bg-error"}>{currentName}</th>)
      }
      
      setElectric(newElectric);
      setWater(newWater);
      setName(newName);
      return () => clearInterval(interval);
    }, 1000);
  }, [])
  
  
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-11/12 bg-base-100 h-full rounded-md shadow-md">
        <h1 className="w-full text-2xl flex justify-center items-center py-4 font-semibold">ข้อมูลค่าเช่า</h1>
        <div className="w-full overflow-x-scroll">
          <table className="table table-xs">
            <tbody>
            <tr>
              <th>ห้อง</th>
              {roomNameElements}
            </tr>
            <tr>
              <th>นาม</th>
              {name}
            </tr>
            <tr>
              <th>ค่าไฟฟ้า</th>
              {electric}
            </tr>
            <tr>
              <th>ค่าน้ำประปา</th>
              {water}
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function RentRoute()
{
  const [apartmentName, setApartmentName] = useState<string>("A101");
  
  return (
    <GridLayout>
      <PageTitle pageName="ตั้งค่าเริ่มต้น"/>
      <div className="flex justify-center items-center w-full h-120">
        <div className="flex justify-center items-center w-11/12 h-full gap-10">
          <Card>
            <Card1Content/>
          </Card>
          <Card>
            <Card2Content apartmentName={apartmentName} setApartmentName={setApartmentName} />
          </Card>
        </div>
      </div>
      <RentTableInfo setApartmentName={setApartmentName} />
    </GridLayout>
  )
}
