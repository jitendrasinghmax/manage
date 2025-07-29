// app/api/organization/add-member/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addMemberToOrg } from "@/server action/organization";

export async function POST(req: NextRequest) {
  try {
    const { orgId, memberId } = await req.json();
    if (!orgId || !memberId) {
      return NextResponse.json(
        { msg: "Organization ID and Member ID required" },
        { status: 400 }
      );
    }

    const updatedOrg = await addMemberToOrg(orgId, memberId);
    return NextResponse.json({ msg: "Member added", org: updatedOrg }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ msg: (e as Error).message }, { status: 500 });
  }
}
