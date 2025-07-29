import { Skeleton } from "@/components/ui/skeleton";

export default function Loading(){
    return <div className="h-screen grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6,7,8].map(()=>{
                return <div className="h-full w-full"><Skeleton className="bg-gray-300/20 h-full w-full"/></div>
            })}
    </div>

}