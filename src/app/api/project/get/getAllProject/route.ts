import { NextRequest, NextResponse } from "next/server";
import { getAllProjects } from "@/server action/project";

export async function POST(req: NextRequest) {
  const { orgId } = await req.json();
  if (!orgId) {
    return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
  }
  try {
    const projects = await getAllProjects(orgId);
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
