import { getUser } from "@/server action/user";
import { NextResponse } from "next/server";

export async function POST(){
    try{
        const user=await getUser();
        return NextResponse.json({msg:"user fetched successfully", user}, {status: 200});
    }
    catch(err){
        return NextResponse.json({error: (err as Error).message}, {status: 500});
    }
}