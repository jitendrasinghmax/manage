import { getTasksByProjectID } from "@/server action/task";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {id}=await req.json();
    if(!id)return NextResponse.json({msg:"payload missing"},{status:500});
    try{  
        const tasks=await getTasksByProjectID(id); 
        return NextResponse.json({msg:"task fetched sucessfully!!!",tasks},{status:200});
    }
    catch(e){
        return NextResponse.json({msg:(e as Error).message},{status:500})
    }
}