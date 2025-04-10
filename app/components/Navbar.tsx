export default function Navbar()
{
  return (
  <div className="navbar bg-accent flex justify-between">
    <a className="btn btn-ghost text-3xl font-bold btn-xl" href="/"> บิลเงินสดอัตโนมัต </a>
    <div>
      <a className="btn btn-ghost" href="/"> ตั้งค่าเช่า </a>
      <a className="btn btn-ghost" href="/print"> ปริ้นท์เอกสาร </a>
    </div>
  </div>
  );
}