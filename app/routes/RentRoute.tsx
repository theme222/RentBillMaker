import PageTitle from "../components/PageTitle";
import GridLayout from "~/components/GridLayout";
import React, {type ReactNode, useState} from "react";

const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear() + 543;

interface PriceValues_t {
  "ค่าเช่า": number;
  "ค่าบริการส่วนกลาง": number;
  "ค่าจัดการขยะมูลฝอย": number;
  "ราคาไฟฟ้า (ต่อ unit)": number;
  "ราคาน้ำ (ต่อ unit)": number;
  [key: string]: number;
}

interface MonthYear_t {
  "month": string;
  "year": number;
}

const thaiMonths:string[] = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม"
];


function DateSetter({monthYear, setMonthYear}: {monthYear: MonthYear_t, setMonthYear: React.Dispatch<React.SetStateAction<MonthYear_t>>})
{
  
  const HandleMonthChange = (month:string) => {
    setMonthYear((prev) => ({...prev, month: month}));
  }
  
  const HandleYearChange= (year:number) => {
    setMonthYear((prev) => ({...prev, year: year}));
  }
  
  const monthElement = thaiMonths.map((month) => <option key={month}>{month}</option>);
  const yearElement = Array(15).fill(0).map((_, i) => currentYear + 1 - i)
    .map((year) => <option key={year}>{year}</option>);
  
  return (
    <div className="flex justify-between items-center h-16 w-full px-5">
      <span className="">ประจำเดือน</span>
      <div className="join">
        <select onChange={(e) => HandleMonthChange(e.target.value)} className="select select-secondary rounded-md join-item w-25" value={monthYear.month}>
          {monthElement}
        </select>
        <select onChange={(e) => HandleYearChange(Number(e.target.value))} className="select select-secondary rounded-md join-item w-20" value={monthYear.year}>
          {yearElement}
        </select>
      </div>
    </div>
  )
}

function ValueSetter({name, value, setValue} : {name: string, value:PriceValues_t, setValue:React.Dispatch<React.SetStateAction<PriceValues_t>>})
{
  
  const HandlePriceChange = (newValue:number) =>
  {
    setValue((prev) => ({...prev, [name]: newValue})); // Wtf is this syntax my guy
  }
  
  // @ts-ignore
  return (
    <div className="flex justify-between items-center h-16 w-full px-5">
      <span className="">{name}</span>
      <label className="input input-success validator w-45">
        <input type="number" className="" min="0" max="9999" onChange={(e) => HandlePriceChange(Number(e.target.value))} required value={value[name] || -1}/>
        <span className="label">บาท</span>
      </label>
    </div>
  )
}

function Card({children}: {children: ReactNode})
{
  return (
    <div className="w-2/5 bg-base-100 border-2 border-base-200 rounded-md shadow-md h-full">
      {children}
    </div>
  )
}

function Card1Content()
{
  const [priceValues, setPriceValues] = useState<PriceValues_t>({
    "ค่าเช่า" : 1200,
    "ค่าบริการส่วนกลาง": 750,
    "ค่าจัดการขยะมูลฝอย": 750,
    "ราคาไฟฟ้า (ต่อ unit)": 9,
    "ราคาน้ำ (ต่อ unit)": 35,
  });
  
  const [monthYear, setMonthYear] = useState({
    month: thaiMonths[currentMonth],
    year: currentYear
  });
  
  return (
    <>
      <h1 className="w-full text-2xl flex justify-center items-center h-20 font-semibold">ข้อมูลส่วนรวม</h1>
      <ValueSetter name="ค่าเช่า" value={priceValues} setValue={setPriceValues}/>
      <ValueSetter name="ค่าบริการส่วนกลาง" value={priceValues} setValue={setPriceValues}/>
      <ValueSetter name="ค่าจัดการขยะมูลฝอย" value={priceValues} setValue={setPriceValues}/>
      <ValueSetter name="ราคาไฟฟ้า (ต่อ unit)" value={priceValues} setValue={setPriceValues}/>
      <ValueSetter name="ราคาน้ำ (ต่อ unit)" value={priceValues} setValue={setPriceValues}/>
      <DateSetter monthYear={monthYear} setMonthYear={setMonthYear}/>
      <div className="flex justify-center items-center w-full h-20">
        <button className="btn btn-primary" onClick={()=>console.log(priceValues, monthYear)}>Log the current values</button>
      </div>
    </>
  )
}

export default function RentRoute()
{
  return (
    <GridLayout>
      <PageTitle pageName="ตั้งค่าเช่า"/>
      <div className="flex justify-center items-center w-full h-150 gap-10">
        <Card>
          <Card1Content />
        </Card>
        <Card>
          <h1 className="w-full text-2xl flex justify-between items-center h-20 font-semibold">
           <div></div>
          </h1>
        </Card>
      </div>
    </GridLayout>
  )
}
