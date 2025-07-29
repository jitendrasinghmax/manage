import { Skeleton } from "../ui/skeleton";
import { useContextProvider } from "@/context/context";

export const MemberData = ({ id }: { id: string }) => {
    const {orgMembers}=useContextProvider();
    return <>
        {orgMembers&&orgMembers.find((m)=>m.id===id) ? <div className="flex gap-x-2">
                    <img src={orgMembers.find((m)=>m.id===id).imgUrl} className="h-6 w-6 rounded-full"></img>
                    <p>{orgMembers.find((m)=>m.id===id).email}</p>
                </div> 
                :
                <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-6 rounded-full bg-gray-300" />
                    <div className="space-y-2">
                <Skeleton className="h-4 w-[250px] bg-gray-300" />
            </div>
        </div>}
    </>
}