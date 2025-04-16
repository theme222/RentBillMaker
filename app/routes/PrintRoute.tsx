import { useRef, type ReactElement } from "react";
import generatePDF from "react-to-pdf";
import GridLayout from "~/components/GridLayout";
import PageTitle from "~/components/PageTitle";
import { GetApartmentInfo, GetPriceValues } from "~/functions/ApartmentFuncs";
import { apartmentNames, type Apartment_t } from "~/types/ApartmentTypes";


const pdfOptions = {
  filename: "bill.pdf",
  page: {
    orientation: 'landscape',
  }
}

function HalfPage({isCopy, apartmentInfo, apartmentName}: { isCopy: boolean, apartmentInfo: Apartment_t, apartmentName: string})
{
  const currentPriceValues = GetPriceValues();
  return (
    <div className="w-1/2 h-full">
      <h1 className="text-3xl flex justify-center items-center h-24">บิลเงินสด <span className="text-error">&nbsp;{isCopy?"(สำเนา)" : ""}</span></h1> 
       <div className="bg-black w-full h-0.25"></div>
       <div className="flex justify-between items-center h-10 text-lg *:px-4">
        <div>
          <span>ชื่อ: {apartmentInfo["นาม"]}</span>
        </div>
        <div>
          <span>ห้อง: {apartmentName}</span>
        </div>
        <div>
          <span>ประจำเดือน: เมษายน 2568</span>
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
                <td>1000</td>
              </tr>
              <tr>
                <td>2</td>
                <td>ค่าบริการส่วนกลาง</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>3</td>
                <td>ค่ารักษาความปลอดภัย</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>4</td>
                <td>ค่าไฟฟ้า</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>5</td>
                <td>ค่าน้ำประปา</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>6</td>
                <td>ค่าจัดการขยะมูลฝอย</td>
                <td>1000</td>
              </tr>
              <tr className="font-bold">
                <td></td>
                <td>รวมเงิน</td>
                <td>3000</td>
              </tr>
            </tbody>
          </table>
      </div>
    </div>
  )
}

function RentBill()
{
  const pageRef = useRef(null);
  const PrintPdf = () => {
    //@ts-ignore
    generatePDF(pageRef, pdfOptions);
  }

  const rentPages: ReactElement[] = [];

  for (let apartmentName of apartmentNames)
  {
    let currentApartmentInfo = GetApartmentInfo(apartmentName);
    if (!currentApartmentInfo) continue;
    rentPages.push(
      <div className="bg-white w-full h-[210mm] flex justify-between border-1 border-black">
        <HalfPage isCopy={true} apartmentInfo={currentApartmentInfo} apartmentName={apartmentName}/>
        <div className="w-0.25 h-full bg-black"></div>
        <HalfPage isCopy={false} apartmentInfo={currentApartmentInfo} apartmentName={apartmentName}/>
      </div>
    )
  }



  return (
    <div className="w-full">
      <div className="w-full flex justify-center items-center">
        <div className="w-[297mm]" ref={pageRef}>
          {rentPages}
        </div>
      </div>
      
      <div className="w-full flex justify-center items-center h-20">
        <button className="btn btn-primary" onClick={PrintPdf}>print this bitch</button>
      </div>
    </div>
  )
}

export default function PrintRoute()
{
  return (
    <GridLayout>
      <PageTitle pageName="พิมพ์ใบเสร็จ"/>
      <RentBill />
    </GridLayout>
  );
}




















