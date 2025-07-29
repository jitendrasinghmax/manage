import { getOrg } from "@/server action/organization";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {orgId}=await req.json();
    if(!orgId){
        return NextResponse.json({msg:"orgID missing"},{status:500});
    }
    try{
        const organization=await getOrg(orgId);
        if(!organization){
            return NextResponse.json({msg:"organization not found"},{status:500});
        }
        return NextResponse.json({mgs:"organization found sucessfully",org:organization},{status:200})
    }
    catch(e){
        return NextResponse.json({msg:(e as Error).message},{status:500})
    }
}