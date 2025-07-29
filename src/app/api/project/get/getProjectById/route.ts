import { getProjectById } from "@/server action/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {id}=await req.json();
    if(!id)return NextResponse.json({msg:"payload missing"},{status:500});
    try{
        const project=await getProjectById(id);
        return NextResponse.json({msg:"project found sucessfuly!!!",project},{status:200});
    }
    catch(e){
        return NextResponse.json({msg:(e as Error).message},{status:500})
    }
}