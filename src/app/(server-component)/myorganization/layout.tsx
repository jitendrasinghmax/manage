import { Separator } from "@/components/ui/separator"

export  default ({children}:{children:React.ReactNode})=>{
    return  <div className="p-6">
      <div className="text-3xl text-white font-extrabold text-center mb-5">Organizations</div>
      <Separator className="mb-6" />
      {children}
      </div>
     
}