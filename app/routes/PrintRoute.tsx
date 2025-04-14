import { useRef } from "react";
import generatePDF from "react-to-pdf";
import GridLayout from "~/components/GridLayout";
import PageTitle from "~/components/PageTitle";

const pdfOptions = {
  filename: "bill.pdf",
  page: {
    orientation: 'landscape',
  }
}

function HalfPage({isCopy}: { isCopy: boolean })
{
  return (
    <div className="w-1/2 h-full">
      <h1 className="text-3xl flex justify-center items-center h-[20mm]">บิลเงินสด <span className="text-error">&nbsp;{isCopy?"(สำเนา)" : ""}</span></h1>
      <table>

      
      </table>
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
  return (
    <div className="w-full grid grid-cols-1 align-items-center">
      <div ref={pageRef} className="bg-white w-[297mm] h-[210mm] flex justify-between">
        <HalfPage isCopy={false}/>
        <HalfPage isCopy={true}/>
      </div>
      <div className="w-full flex justify-center items-center">
        <button className="btn btn-primary" onClick={PrintPdf}>print this bitch</button>
      </div>
    </div>
  )
}

export default function PrintRoute()
{
  return (
    <GridLayout>
      <PageTitle pageName="ปริ้นท์เอกสาร"/>
      <RentBill />
    </GridLayout>
    
    
  );
}




















