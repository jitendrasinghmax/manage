import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export const createProject = async (
  name: string,
  slug: string,
  desc: string,
  organization: string,
  members: string[],
  deadline: Date
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  try {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) throw new Error("User not found");
    members.push(user.id);
    const org=await db.organization.findUnique({
      where:{
        id:organization
      }
    })
    if(!org)throw new Error("organization does not exist");
    const orgMembers=org.members;
      console.log(members, orgMembers);
    if(!members.every((m)=>orgMembers.includes(m)))throw new Error("organization does not exist");
    const project = await db.project.create({
      data: {
        name,
        slug,
        desc,
        organization,
        members,
        createdAt:new Date(),
        deadline: new Date(deadline),
        status: "TODO",
      },
    });

    return project;
  } catch (err) {
    throw new Error((err as Error).message || "Failed to create project");
  }
};

export const getAllProjects = async (orgId:string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    // Find all projects where user is a member
    const projects = await db.project.findMany({
      where: {
        organization: orgId,
        members: {
          has: user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  } catch (err) {
    throw new Error("Failed to fetch projects");
  }
};

export const getProjectById = async (projectId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) throw new Error("Project not found");
    if (!project.members.includes(user.id)) throw new Error("Access denied");

    return project;
  } catch (err) {
    throw new Error((err as Error).message || "Failed to fetch project");
  }
};

export const updateProject = async (
    id: string,
    status: "TODO"|"IN_PROGRESS"|"DONE"|"BLOCKED",
    name?: string,
    slug?: string,
    desc?: string,
    members?: string[],
    deadline?: Date,
    
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });
  if (!user) throw new Error("User not found");

  const project = await db.project.findUnique({
    where: { id },
  });
  if (!project) throw new Error("Project not found");
  if (!project.members.includes(user.id)) throw new Error("Access denied");

  try {
    const updatedProject = await db.project.update({
      where: { id },
      data: {
        name,
        desc,
        slug,
        members,
        status,
        deadline: deadline ? new Date(deadline) : undefined,
      },
    });
    return updatedProject;
  } catch (err) {
    throw new Error((err as Error).message || "Failed to update project");
  }
};