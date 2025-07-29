import { auth } from "@clerk/nextjs/server";

export const createTask=async(aim:string,
                              description:string,
                              deadline:string,
                              priority:'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
                              members:string[],
                              projectId:string,
                              status?: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE')=>{
    const {userId}=await auth();
    if(!userId) throw new Error("User not authenticated");
    const user=await db.user.findUnique({
        where:{
            clerkId:userId
        }
    })
    if(!user) throw new Error("User not found");
    const project=await db.project.findUnique({
        where:{
            id:projectId
        }
    })
    if(!project) throw new Error("Project not found");

    members.push(user.id)
    
    if(!members.every((m)=>project.members.includes(m)))throw new Error("You are not a member of this project");

    try {
        const task=await db.task.create({
            data:{
                aim,
                description,
                deadline,
                priority,
                members,
                projectId,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });
        return task;
    } catch (error) {
        throw new Error("Error creating task");
    }
}


export const updateTask = async (
  id: string,
    aim: string,
    description: string,
    deadline: string,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    members: string[],
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
  
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user=await db.user.findUnique({
    where:{
        clerkId:userId
    }
})
if(!user) throw new Error("User not found");

  const task = await db.task.findUnique({ where: { id } });
  if (!task) throw new Error("Task not found");

  const project = await db.project.findUnique({ where: { id: task.projectId } });
  if (!project) throw new Error("Project not found");

  if (!project.members.includes(user.id))
    throw new Error("You are not a member of this project");

  if (members && !members.every((m) => project.members.includes(m)))
    throw new Error("Some assigned members are not part of the project");

  try {
    const updatedTask = await db.task.update({
      where: { id },
      data: {
            aim,
            description,
            deadline: deadline ? new Date(deadline) : task.deadline,
            priority,
            members,
            status,
            updatedAt: new Date(),
      },
    });
    return updatedTask;
  } catch (error) {
    throw new Error("Error updating task");
  }
};

export const deleteTask = async (id: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const task = await db.task.findUnique({ where: { id } });
  if (!task) throw new Error("Task not found");

  const project = await db.project.findUnique({ where: { id: task.projectId } });
  if (!project) throw new Error("Project not found");

  if (!task.members.includes(userId))
    throw new Error("You are not a member of this project");

  try {
    await db.task.delete({ where: { id } });
    return;
  } catch (error) {
    throw new Error("Error deleting task");
  }
};

export const getTasksByProjectID = async (projectId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

      const user=await db.user.findUnique({
        where:{
            clerkId:userId
        }
    })
        if(!user) throw new Error("User not found");

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new Error("Project not found");

  if (!project.members.includes(user.id))
    throw new Error("You are not a member of this project");

  try {
    const tasks = await db.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
    return tasks;
  } catch (error) {
    throw new Error("Error fetching tasks");
  }
};