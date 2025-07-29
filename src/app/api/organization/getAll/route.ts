import { getAllOrgs } from "@/server action/organization";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    
    try{
        const organizations=await getAllOrgs();
        if(!organizations){
            return NextResponse.json({msg:"organization not found"},{status:500});
        }
        return NextResponse.json({mgs:"organization found sucessfully",orgs:organizations},{status:200})
    }
    catch(e){
        return NextResponse.json({msg:(e as Error).message},{status:500})
    }
}