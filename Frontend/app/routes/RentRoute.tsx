import PageTitle from "~/components/PageTitle";
import GridLayout from "~/components/GridLayout";
import React, {
  type ReactElement,
  type ReactNode,
  useEffect,
  useState,
  useRef,
  useContext,
  createContext,
} from "react";
import {
  type Apartment_t,
  type PriceValues_t,
  apartmentBuildings,
  apartmentFloors,
  apartmentNumbers,
  apartmentNames,
  Apartment,
  GlobalFees,
} from "~/types/ApartmentTypes";
import { thaiMonths, type MonthYear_t } from "~/types/DateTypes";
import { type ReactState, type ReactRef } from "~/types/EsotericReactTypes";
import { EnlgishToThai } from "~/functions/InToOutTranslator";
import { UpdateRentList, GetRentList } from "~/functions/APIFuncs";

interface rentRouteContextExistsInterface {
  globalFeesState: PriceValues_t;
  setGlobalFeesState: ReactState<PriceValues_t>;
  rentList: { [key: string]: Apartment };
  setRentList: ReactState<{ [key: string]: Apartment }>;
  apartmentName: string;
  setApartmentName: ReactState<string>;
  dataHasLoaded: ReactRef<boolean>;
  SaveDataToBackend: () => Promise<void>;
  LoadDataFromBackend: () => Promise<void>;
}

const RentRouteContext = createContext<rentRouteContextExistsInterface | null>(
  null
);

function DateSetter() {
  const {
    globalFeesState,
    setGlobalFeesState,
    rentList,
    setRentList,
    dataHasLoaded,
    LoadDataFromBackend,
    SaveDataToBackend,
  } = useContext(RentRouteContext) as rentRouteContextExistsInterface;

  const HandleMonthChange = async (month: string) => {
    const newGlobalFees = { ...globalFeesState, ["เดือน"]: month };
    await SaveDataToBackend();
    dataHasLoaded.current = false;
    GlobalFees.LoadFromState(newGlobalFees);
    LoadDataFromBackend();
  };

  const HandleYearChange = async (year: number) => {
    const newGlobalFees = { ...globalFeesState, ["ปี"]: year };
    await SaveDataToBackend();
    dataHasLoaded.current = false;
    GlobalFees.LoadFromState(newGlobalFees);
    LoadDataFromBackend();
  };

  const monthElement = thaiMonths.map((month) => (
    <option key={month}>{month}</option>
  ));
  const yearElement = Array(15)
    .fill(0)
    .map((_, i) => GlobalFees.currentYear + 1 - i)
    .map((year) => <option key={year}>{year}</option>);

  return (
    <div className="flex justify-center items-center gap-5 h-16 w-full px-5">
      <span className="">ประจำเดือน</span>
        <select
          onChange={(e) => HandleMonthChange(e.target.value)}
          className="select select-secondary rounded-md join-item w-30"
          value={globalFeesState["เดือน"]}
        >
          {monthElement}
        </select>
        <select
          onChange={(e) => HandleYearChange(Number(e.target.value))}
          className="select select-secondary rounded-md join-item w-20"
          value={globalFeesState["ปี"]}
        >
          {yearElement}
        </select>
    </div>
  );
}

function ValueSetter({ propertyName }: { propertyName: string }) {
  const { globalFeesState, setGlobalFeesState, rentList } = useContext(
    RentRouteContext
  ) as rentRouteContextExistsInterface;

  const HandlePriceChange = (newValue: number) => {
    let newGlobalFeesState = { ...globalFeesState, [propertyName]: newValue };

    setGlobalFeesState(newGlobalFeesState);
  };

  return (
    <div className="flex justify-between items-center h-16 w-100 px-5">
      <span className="">{propertyName}</span>
      <label className="input input-success validator w-45">
        <input
          type="number"
          className=""
          min="1"
          onChange={(e) => HandlePriceChange(Number(e.target.value))}
          required
          value={globalFeesState[propertyName] || 1}
        />
        <span className="label">บาท</span>
      </label>
    </div>
  );
}

function DynamicValueSetter({
  propertyName,
}: {
  propertyName: "water" | "electricity" | "name";
}) {
  const { rentList, setRentList, apartmentName } = useContext(
    RentRouteContext
  ) as rentRouteContextExistsInterface;

  const [unitAfter, setUnitAfter] = useState<number | string>(0);

  const HandleValueChange = (value: string | number) => {
    if (propertyName != "name") value = Number(value);
    const newRentList: { [key: string]: Apartment } = { ...rentList };
    if (!newRentList[apartmentName])
      newRentList[apartmentName] = new Apartment(apartmentName);
    newRentList[apartmentName].SetProperty(propertyName, value);

    setUnitAfter(value);
    setRentList(newRentList);
    //localStorage.setItem("rentList", JSON.stringify(newRentList));
  };

  useEffect(() => {
    if (rentList[apartmentName]) {
      setUnitAfter(rentList[apartmentName].GetProperty(propertyName) || "");
    } else setUnitAfter(0);
  }, [apartmentName, rentList]);

  return (
    <div className="flex justify-between items-center h-16 w-100 px-5">
      <span className="">{EnlgishToThai[propertyName]}</span>
      <div className="flex items-center">
        <label className="input input-success validator w-40">
          <input
            type={propertyName != "name" ? "number" : "text"}
            className=""
            min="0"
            value={unitAfter}
            onChange={(e) => HandleValueChange(e.target.value)}
          />
          {propertyName != "name" ? <span className="label">Unit</span> : <></>}
        </label>
      </div>
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-11/12 bg-white border-md shadow-md">
        {children}
      </div>
    </div>
  );
}

function Card1Content() {
  const { globalFeesState, setGlobalFeesState } = useContext(
    RentRouteContext
  ) as rentRouteContextExistsInterface;

  useEffect(() => {
    const interval = setInterval(() => {
      //if (localStorage.getItem("priceValues"))
      //  setPriceValues(JSON.parse(localStorage.getItem("priceValues") as string));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <h1 className="w-full text-2xl flex justify-center items-center h-20 font-semibold">
      ข้อมูลส่วนรวม
    </h1>
    <div className="w-full h-full grid grid-rows-2 grid-cols-3 justify-items-center">
      <ValueSetter propertyName="ค่าเช่า" />
      <ValueSetter propertyName="ค่าบริการส่วนกลาง" />
      <ValueSetter propertyName="ค่ารักษาความปลอดภัย" />
      <ValueSetter propertyName="ค่าจัดการขยะมูลฝอย" />
      <ValueSetter propertyName="ราคาไฟฟ้า (ต่อ unit)" />
      <ValueSetter propertyName="ราคาน้ำ (ต่อ unit)" />
      <div className=""></div>
      <DateSetter />
    </div>
    </>
  );
}

function Card2Content() {
  const {
    rentList,
    setRentList,
    apartmentName,
    setApartmentName,
    globalFeesState,
    setGlobalFeesState,
  } = useContext(RentRouteContext) as rentRouteContextExistsInterface;
  const buildingSelect = apartmentBuildings.map((name) => (
    <option key={name}>{name}</option>
  ));
  const floorSelect = apartmentFloors.map((name) => (
    <option key={name}>{name}</option>
  ));
  const numberSelect = apartmentNumbers.map((name) => (
    <option key={name}>{name}</option>
  ));

  const [deleteButton, setDeleteButton] = useState<boolean>(false);

  /*
  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("rentList"))
        setRentList(
          Apartment.LoadFromRentList(
            JSON.parse(localStorage.getItem("rentList") as string)
          )
        );
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  */

  return (
    <>
      <div className="w-full flex justify-center items-center h-20 font-semibold *:text-xl">
        <div className="rounded-md border-2 border-primary bg-white w-62 flex justify-center">
          <span className="text-lg min-w-15 flex items-center justify-center">
            ห้อง :
          </span>
          <select
            className="select select-ghost"
            value={apartmentName[0]}
            onChange={(e) => {
              setApartmentName(e.target.value + apartmentName.slice(1));
            }}
          >
            {buildingSelect}
          </select>
          <select
            className="select select-ghost"
            value={apartmentName[1]}
            onChange={(e) => {
              setApartmentName(
                apartmentName[0] + e.target.value + apartmentName.slice(2)
              );
            }}
          >
            {floorSelect}
          </select>
          <select
            className="select select-ghost w-20"
            value={apartmentName.slice(2)}
            onChange={(e) => {
              setApartmentName(apartmentName.slice(0, 2) + e.target.value);
            }}
          >
            {numberSelect}
          </select>
        </div>
      </div>

      <div className="w-full grid grid-rows-1 grid-cols-3 justify-items-center pb-2">
        <DynamicValueSetter propertyName="name" />
        <DynamicValueSetter propertyName="electricity" />
        <DynamicValueSetter propertyName="water" />
      </div>
    </>
  );
}

function RentTableInfo() {
  const { rentList, setApartmentName } = useContext(
    RentRouteContext
  ) as rentRouteContextExistsInterface;
  const roomNameElements = apartmentNames.map((e) => (
    <th
      key={e}
      className="underline cursor-pointer"
      onClick={() => setApartmentName(e)}
    >
      {e}
    </th>
  ));

  const electric: ReactElement[] = [];
  const water: ReactElement[] = [];
  const name: ReactElement[] = [];

  Object.values(rentList).forEach((room) => {
    electric.push(
      <th
        key={room.roomName}
        className={room.electricity > 0 ? "bg-success" : "bg-error"}
      >
        {room.electricity}
      </th>
    );
    water.push(
      <th
        key={room.roomName}
        className={room.water > 0 ? "bg-success" : "bg-error"}
      >
        {room.water}
      </th>
    );
    name.push(
      <th
        key={room.roomName}
        className={room.name.length > 0 ? "bg-success" : "bg-error"}
      >
        {room.name}
      </th>
    );
  });

  /*
  useEffect(() => {
    let interval = setInterval(() => {
      let newElectric: ReactElement[] = [];
      let newWater: ReactElement[] = [];
      let newName: ReactElement[] = [];

      for (let roomName of apartmentNames) {
        let currentElectric: number = 0;
        let currentWater: number = 0;
        let currentName: string = "";

        if (rentList[roomName]) {
          currentElectric = Number(rentList[roomName].electricity);
          currentWater = Number(rentList[roomName].water);
          currentName = rentList[roomName].name;
        }

        newElectric.push(
          <th
            key={roomName}
            className={currentElectric > 0 ? "bg-success" : "bg-error"}
          >
            {currentElectric}
          </th>
        );
        newWater.push(
          <th
            key={roomName}
            className={currentWater > 0 ? "bg-success" : "bg-error"}
          >
            {currentWater}
          </th>
        );
        newName.push(
          <th
            key={roomName}
            className={currentName.trim() ? "bg-success" : "bg-error"}
          >
            {currentName}
          </th>
        );
      }

      setElectric(newElectric);
      setWater(newWater);
      setName(newName);
      return () => clearInterval(interval);
    }, 1000);
  }, []);
  */

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-11/12 bg-base-100 h-full rounded-md shadow-md">
        <h1 className="w-full text-2xl flex justify-center items-center py-4 font-semibold">
          ข้อมูลค่าเช่า
        </h1>
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
  );
}

export default function RentRoute() {
  const dataHasLoaded = useRef(false);
  const apiCooldown = useRef(false);
  const [apartmentName, setApartmentName] = useState<string>("A101");
  const [rentList, setRentList] = useState<{ [key: string]: Apartment }>({});
  const [globalFeesState, setGlobalFeesState] = useState<PriceValues_t>(
    GlobalFees.GetState()
  );

  const DoAPICooldown = () => {
    apiCooldown.current = true;
    setTimeout(() => {
      apiCooldown.current = false;
    }, 1500);
  };

  const LoadDataFromBackend = async () => {
    const data = await GetRentList(GlobalFees.GetMonthYear());
    console.log("Loaded data from backend", data);
    setRentList(Apartment.ApartmentListToRentList(data.apartmentList));
    GlobalFees.LoadFromObject(data.globalFees);
    setGlobalFeesState(GlobalFees.GetState());
    dataHasLoaded.current = true;
  };

  const SaveDataToBackend = async () => {
    console.log("Autosaving...");
    GlobalFees.LoadFromState(globalFeesState);
    await UpdateRentList(Object.values(rentList), GlobalFees.Dump());
  };

  // Get the most recent save from the backend on page load
  useEffect(() => {
    LoadDataFromBackend();
  }, []);

  // This is the autosave feature
  useEffect(() => {
    if (!dataHasLoaded.current) return;
    if (apiCooldown.current) return;
    DoAPICooldown();
    SaveDataToBackend();
  }, [globalFeesState, rentList]);

  return (
    <RentRouteContext.Provider
      value={{
        rentList,
        setRentList,
        apartmentName,
        setApartmentName,
        globalFeesState,
        setGlobalFeesState,
        dataHasLoaded,
        LoadDataFromBackend,
        SaveDataToBackend,
      }}
    >
      <GridLayout>
        <PageTitle pageName="ตั้งค่าเริ่มต้น" />
          <Card>
            <Card1Content />
          </Card>
          <Card>
            <Card2Content />
          </Card>
        <RentTableInfo />
      </GridLayout>
    </RentRouteContext.Provider>
  );
}
