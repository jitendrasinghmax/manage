import { updateProject } from "@/server action/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {id,status,name,desc,slug,members,deadline}=await req.json();
    if(!["TODO","IN_PROGRESS","DONE","BLOCKED"].some((s)=>s===status)){
        return NextResponse.json({msg:"staus not accepted"},{status:500});
    }
    try{
        const updatedProject=await updateProject(id,status,name,slug,desc,members,deadline)
        return NextResponse.json({msg:"project updates sucesfully",project:updatedProject},{status:200})
    }catch(e){
        return NextResponse.json({msg:(e as Error).message},{status:500})
    }
} 