import { createContext, useRef, type ReactElement, useState, useContext } from "react";
import generatePDF from "react-to-pdf";
import GridLayout from "~/components/GridLayout";
import PageTitle from "~/components/PageTitle";
import { type ReactRef, type ReactState } from "~/types/EsotericReactTypes";
import { apartmentNames, type Apartment_t, type PriceValues_t, Apartment, GlobalFees } from "~/types/ApartmentTypes";
import { GetBillList, GetRentList } from "~/functions/APIFuncs";
import { type Options } from "react-to-pdf";
import { thaiMonths } from "~/types/DateTypes";

interface printRouteContextExistsInterface
{
  globalFeesState: PriceValues_t;
  setGlobalFeesState: ReactState<PriceValues_t>;
  rentList: { [key: string]: Apartment };
  setRentList: ReactState<{ [key: string]: Apartment }>;
  dataHasLoaded: ReactRef<boolean>;
  LoadDataFromBackend: () => Promise<void>;
}

const PrintRouteContext = createContext < printRouteContextExistsInterface | null>(null)

const pdfOptions: Options = {
  filename: "bill.pdf",
  page: {
    orientation: 'landscape',
  }
}

function PrintConfig()
{
  const { globalFeesState, setGlobalFeesState, LoadDataFromBackend } = useContext(PrintRouteContext) as printRouteContextExistsInterface;

  const HandleMonthChange = async (month: string) => {
    const newGlobalFees = { ...globalFeesState, ["เดือน"]: month };
    GlobalFees.LoadFromState(newGlobalFees);
    setGlobalFeesState(newGlobalFees);
  };

  const HandleYearChange = async (year: number) => {
    const newGlobalFees = { ...globalFeesState, ["ปี"]: year };
    GlobalFees.LoadFromState(newGlobalFees);
    setGlobalFeesState(newGlobalFees);
  };

  const monthElement = thaiMonths.map((month) => (
    <option key={month}>{month}</option>
  ));
  const yearElement = Array(15)
    .fill(0)
    .map((_, i) => GlobalFees.currentYear + 1 - i)
    .map((year) => <option key={year}>{year}</option>);

  return (
    <div className="w-full h-20 flex justify-center items-center gap-5">
      <div className="flex justify-center items-center h-full w-84 px-5 bg-indigo-200 rounded-md gap-2">
        <span className="">ประจำเดือน: </span>
          <select
            className="select select-secondary rounded-md join-item w-28"
            value={globalFeesState["เดือน"]}
            onChange={(e) => HandleMonthChange(e.target.value)}
          >
            {monthElement}
          </select>
          <select
            className="select select-secondary rounded-md join-item w-20"
            value={globalFeesState["ปี"]}
            onChange={(e) => HandleYearChange(Number(e.target.value))}
          >
            {yearElement}
          </select>
      </div>
      <div className="px-5 bg-indigo-200 rounded-md h-full flex justify-center items-center">
        <button className="btn btn-primary" onClick={LoadDataFromBackend}>
          พิมพ์ใบเสร็จ
        </button>
      </div>
    </div>
  );

}

function HalfPage({ roomName, isCopy }: { roomName: string, isCopy: boolean })
{
  const { rentList, dataHasLoaded } = useContext(PrintRouteContext) as printRouteContextExistsInterface;
  if (rentList[roomName].water < 150) rentList[roomName].water = 150;
  if (rentList[roomName].electricity < 150) rentList[roomName].electricity = 150;

  let totalPrice = GlobalFees.rent + GlobalFees.serviceFee + GlobalFees.safetyFee + rentList[roomName].water + rentList[roomName].electricity + GlobalFees.wasteFee

  return (
    <div className="w-1/2 h-full">
      <h1 className="text-3xl flex justify-center items-center h-24">บิลเงินสด<span className="text-error">&nbsp;{isCopy?"(สำเนา)" : ""}</span></h1>
       <div className="bg-black w-full h-0.25"></div>
       <div className="flex justify-between items-center h-10 text-lg *:px-4">
        <div>
          <span>ชื่อ: {rentList[roomName]["name"]}</span>
        </div>
        <div>
          <span>ห้อง: {roomName}</span>
        </div>
        <div>
          <span>ประจำเดือน: {GlobalFees.GetMonthYear()}</span>
        </div>
      </div>
      <div className="w-full h-0.25 bg-black"></div>
      <div className="flex justify-center items-center w-full">
        <table className="table w-11/12">
          <thead>
            <th className="w-10">ลำดับ</th>
            <th className="text-center">รายการ</th>
            <th className="w-20">จำนวนเงิน</th>
          </thead>
          <tbody className="*:*:odd:text-right">
            <tr>
              <td>1</td>
              <td>ค่าเช่าห้อง</td>
              <td>{GlobalFees.rent}</td>
            </tr>
            <tr>
              <td>2</td>
              <td>ค่าบริการส่วนกลาง</td>
              <td>{ GlobalFees.serviceFee }</td>
            </tr>
            <tr>
              <td>3</td>
              <td>ค่ารักษาความปลอดภัย</td>
              <td>{ GlobalFees.safetyFee}</td>
            </tr>
            <tr>
              <td>4</td>
              <td>ค่าไฟฟ้า</td>
              <td>{ rentList[roomName].electricity }</td>
            </tr>
            <tr>
              <td>5</td>
              <td>ค่าน้ำประปา</td>
              <td>{ rentList[roomName].water }</td>
            </tr>
            <tr>
              <td>6</td>
              <td>ค่าจัดการขยะมูลฝอย</td>
              <td>{ GlobalFees.wasteFee }</td>
            </tr>
            <tr className="font-bold">
              <td></td>
              <td>รวมเงิน</td>
              <td>{ totalPrice }</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RentBill()
{
  const { dataHasLoaded, rentList } = useContext(PrintRouteContext) as printRouteContextExistsInterface;
  if (!dataHasLoaded) return (<></>);

  const A1Ref = useRef(null);
  const A2Ref = useRef(null);
  const A3Ref = useRef(null);
  const B1Ref = useRef(null);
  const B2Ref = useRef(null);
  const B3Ref = useRef(null);

  const PrintPdf = () => {
    generatePDF(A1Ref, pdfOptions);
    generatePDF(A2Ref, pdfOptions);
    generatePDF(A3Ref, pdfOptions);
    generatePDF(B1Ref, pdfOptions);
    generatePDF(B2Ref, pdfOptions);
    generatePDF(B3Ref, pdfOptions);
  }

  const rentPages: {[key: string]: ReactElement[]} = {"A1": [], "A2": [], "A3": [], "B1": [], "B2": [], "B3": []};

  for (let apartmentName of apartmentNames)
  {
    if (!rentList[apartmentName] || !rentList[apartmentName].ValidApartment()) continue;
    rentPages[apartmentName.slice(0,2)].push(
      <div className="bg-white w-full h-[210mm] flex justify-between border-1 border-black">
        <HalfPage isCopy={true} roomName={apartmentName} />
        <div className="w-0.25 h-full bg-black"></div>
        <HalfPage isCopy={false} roomName={apartmentName} />
      </div>
    )
  }


  return (
    <div className="w-full">
      <div className="w-full flex justify-center h-20">
        <button className="btn btn-primary" onClick={PrintPdf}>print this bitch</button>
      </div>

      <div className="w-full grid justify-items-center">
        <div className="w-[297mm]" ref={A1Ref}>
          {rentPages["A1"]}
        </div>
        <div className="w-[297mm]" ref={A2Ref}>
          {rentPages["A2"]}
        </div>
        <div className="w-[297mm]" ref={A3Ref}>
          {rentPages["A3"]}
        </div>
        <div className="w-[297mm]" ref={B1Ref}>
          {rentPages["B1"]}
        </div>
        <div className="w-[297mm]" ref={B2Ref}>
          {rentPages["B2"]}
        </div>
        <div className="w-[297mm]" ref={B3Ref}>
          {rentPages["B3"]}
        </div>
      </div>


    </div>
  )
}

export default function PrintRoute()
{
  const dataHasLoaded = useRef(false);
  const [rentList, setRentList] = useState<{ [key: string]: Apartment }>({});
  const [globalFeesState, setGlobalFeesState] = useState<PriceValues_t>(GlobalFees.GetState());

  const LoadDataFromBackend = async () => {
    const data = await GetBillList(GlobalFees.GetMonthYear());
    console.log("Loaded complete bill list ", data);
    setRentList(Apartment.ApartmentListToRentList(data.billList));
    GlobalFees.LoadFromObject(data.globalFees);
    setGlobalFeesState(GlobalFees.GetState());
    dataHasLoaded.current = true;
  };

  return (
    <PrintRouteContext.Provider value={{
      globalFeesState,
      setGlobalFeesState,
      dataHasLoaded,
      setRentList,
      rentList,
      LoadDataFromBackend
    }}>
      <GridLayout>
        <PageTitle pageName="พิมพ์ใบเสร็จ"/>
        <PrintConfig />
        {dataHasLoaded.current ? <RentBill />: <></>}
      </GridLayout>
    </PrintRouteContext.Provider>
  );
}
