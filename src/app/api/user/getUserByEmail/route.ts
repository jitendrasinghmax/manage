import { getUsersByEmail } from "@/server action/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { email } = await req.json();
    try {
        if(email.length===0)return NextResponse.json({ msg: "user found sucessfull",users:[] }, { status: 200 });
        const users=await getUsersByEmail(email)
        return NextResponse.json({ msg: "user found sucessfull", users }, { status: 200 })
    }
    catch (e) {
        console.log((e as Error).message)
        return NextResponse.json({ msg: (e as Error).message }, { status: 500 })
    }
}