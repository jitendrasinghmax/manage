import { createTask } from "@/server action/task";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { aim, description, deadline, priority, members, projectId, status } = body;

    const task = await createTask(
      aim,
      description,
      deadline,
      priority,
      members,
      projectId,
      status
    );

    return NextResponse.json({"msg":"sucessfylly task created", task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
