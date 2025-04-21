export default function Navbar()
{
  return (
  <div className="navbar bg-accent flex justify-between">
    <a className="btn btn-ghost text-3xl font-bold btn-xl" href="/"> บิลเงินสดอัตโนมัติ </a>
    <div>
      <a className="btn btn-ghost" href="/"> ตั้งค่าเริ่มต้น </a>
      <a className="btn btn-ghost" href="/print"> พิมพ์ใบเสร็จ </a>
    </div>
  </div>
  );
}