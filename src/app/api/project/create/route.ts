import { createProject } from "@/server action/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, slug, desc, organization, members, deadline } = body;
    console.log( name, slug, desc, organization, members, deadline)
    if (!name || !slug || !desc || !organization || !deadline) {
      return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
    }

    const project = await createProject(name, slug, desc, organization, members || [], deadline);
    return NextResponse.json({ msg: "Project created successfully", project }, { status: 201 });
  } catch (err) {
    console.error("Error creating project:", (err as Error).message);
    return NextResponse.json({ msg: (err as Error).message }, { status: 500 });
  }
}
