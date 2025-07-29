import { createOrg } from "@/server action/organization";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {name,desc,slug,members}=await req.json();
    if(!name||!desc||!slug)NextResponse.json({msg:"pay load missing"},{status:500});
    try{
        const org=await createOrg(name,desc,slug,members);
        return NextResponse.json({msg:"org created sucessfully",org},{status:201})
    }
    catch(e){
        return NextResponse.json({msg:(e as Error).message},{status:500})
    }
}