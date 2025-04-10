// @ts-ignore
export default function GridLayout ({children})
{
  return (
    <div className="grid grid-cols-1 content-start absolute top-28 gap-10 w-full min-h-screen">
      {children}
    </div>
  )
}