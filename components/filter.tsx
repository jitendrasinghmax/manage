import { Button } from "./ui/button";
const statusOptions = ["ALL", "TODO", "IN_PROGRESS", "REVIEW", "DONE"];

export default function ({filterStatus,setFilterStatus}){
    return (
        <div className="flex gap-x-20 overflow-auto py-2">
            {
                statusOptions.map((t)=>{
                    return <Button variant={filterStatus===t?"secondary":"outline"} onClick={()=>setFilterStatus(t)}>{t}</Button>
                })
            }
        </div>
    )
}