export default function PageTitle(prop: {pageName : string})
{
  return (
    <div className="flex justify-center items-center w-full">
      <h1 className="text-4xl font-bold">{prop.pageName}</h1>
    </div>
  );
}
