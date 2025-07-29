import { updateTask } from "@/server action/task";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, aim, description, deadline, priority, members, status } = body;

    const updatedTask = await updateTask(
      id,
      aim,
      description,
      deadline,
      priority,
      members,
      status
    );

    return NextResponse.json({msg:"sucessfully updated", task: updatedTask }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
