import GridLayout from "~/components/GridLayout";
import PageTitle from "~/components/PageTitle";

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
  return (
    <div className="w-full flex justify-center">
      <div className="bg-white w-[297mm] h-[210mm] flex justify-between">
        <HalfPage isCopy={false}/>
        <HalfPage isCopy={true}/>
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
      <RentBill />
      <RentBill />
      <RentBill />
    </GridLayout>
    
    
  );
}




















