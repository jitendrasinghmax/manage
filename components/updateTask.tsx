import { useFetch } from "@/hook/useFetch";
import { useEffect, useState } from "react"

export default ({id,tasks,setTasks})=>{
    const [currentTask,setCurretTask]=useState(null);
    const [loading,setLoading]=useState(false);
    const {post}=useFetch()
    const updateTask=async ()=>{
        try{
            setLoading(true);
            const updatedTask=await post("/api/task/update","POST",{currentTask})
        }
        catch(e){}
        finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        setCurretTask(()=>tasks.find((t)=>t.id===id));
    },[])
    if(!currentTask)return <div>Loading...</div>

    return <div>update task</div>
}