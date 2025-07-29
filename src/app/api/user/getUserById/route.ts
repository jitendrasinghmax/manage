import { getUserById } from "@/server action/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { id } = await req.json();
    if(!id){
        return NextResponse.json({msg:"payLoad missing"},{status:500})
    }
    try {
        const user=await getUserById(id)
        return NextResponse.json({ msg: "user found sucessfull", user }, { status: 200 })
    }
    catch (e) {
        console.log((e as Error).message)
        return NextResponse.json({ msg: (e as Error).message }, { status: 500 })
    }
}