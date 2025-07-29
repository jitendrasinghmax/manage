import { deleteMemberFromOrg } from "@/server action/organization";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { orgId, memberId } = await req.json();

  if (!orgId || !memberId) {
    return NextResponse.json({ msg: "Missing payload" }, { status: 400 });
  }

  try {
    const updatedOrg = await deleteMemberFromOrg(orgId, memberId);
    return NextResponse.json({ msg: "Member removed", org: updatedOrg }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ msg: (e as Error).message }, { status: 500 });
  }
}
