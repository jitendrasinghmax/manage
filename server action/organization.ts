import { auth } from "@clerk/nextjs/server"

export const createOrg=async(name:string,desc:string,slug:string,members:string[])=>{
    const {userId}=await auth();
    if(!userId) throw new Error("User not authenticated");
    const user=await db.user.findUnique({
        where:{
            clerkId:userId
        }
    })
    if(!user) throw new Error("User not found");
    try {
        const org = await db.organization.create({
            data: {
                name,
                desc,
                slug,
                adminId:user.id,
                members:[...members,user.id]
            }
        });
        return org;
    } catch (error) {
        throw new Error("Error creating organization");
    }
}

export const getOrg=async(slug:string)=>{
    const {userId}=await auth();
    if(!userId) throw new Error("User not authenticated");
        const user=await db.user.findUnique({
        where:{
            clerkId:userId
        }
    })
    if(!user) throw new Error("User not found");
    try {
        const orgBySlug = await db.organization.findUnique({
            where: {
                slug,
                OR:[
                    {
                        adminId:user.id
                    },
                    {
                        members:{
                            has:user.id
                        }
                    }
                ]
            }
        });
        if(orgBySlug)return orgBySlug;
        const orgById=await db.organization.findUnique({
            where: {
                id:slug,
                OR:[
                    {
                        adminId:user.id
                    },
                    {
                        members:{
                            has:user.id
                        }
                    }
                ]
            }
        });
        return orgById;
    } catch (error) {
        throw new Error("Error creating organization");
    }
}

export const getAllOrgs=async ()=>{
    const {userId}=await auth();
    if(!userId) throw new Error("User not authenticated");
    const user=await db.user.findUnique({
        where:{
            clerkId:userId
        }
    })
    if(!user)throw new Error("user not found");
    try{
        const orgs=await db.organization.findMany({
            where:{
                OR:[
                    {
                        adminId:user.id
                    },
                    {
                        members:{
                            has:user.id
                        }
                    }
                ]
            }
        })
        if(!orgs)throw new Error("Error geting all organiziation")
        return orgs
    }
    catch(e){
        throw new Error("Error geting all organiziation")
    }
}


export const addMemberToOrg = async (
  orgId: string,
  memberId: string
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const currentUser = await db.user.findUnique({
    where: { clerkId: userId },
  });
  if (!currentUser) throw new Error("User not found");

  const org = await db.organization.findUnique({
    where: { id: orgId },
  });
  if (!org) throw new Error("Organization not found");

  if (org.adminId !== currentUser.id)
    throw new Error("Only admin can add members");

  // Check if member already exists
  if (org.members.includes(memberId))
    throw new Error("Member already exists");

  const updatedOrg = await db.organization.update({
    where: { id: orgId },
    data: {
      members: {
        push: memberId,
      },
    },
  });

  return updatedOrg;
};

export const deleteMemberFromOrg = async (orgId: string, memberId: string) => {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const currentUser = await db.user.findUnique({
    where: { clerkId: userId }
  });

  if (!currentUser) throw new Error("User not found");

  // Check if current user is the admin of the organization
  const org = await db.organization.findUnique({
    where: { id: orgId }
  });

  if (!org) throw new Error("Organization not found");

  if (org.adminId !== currentUser.id) {
    throw new Error("Only admin can remove members");
  }

  // Remove memberId from members array
  const updatedOrg = await db.organization.update({
    where: { id: orgId },
    data: {
      members: {
        set: org.members.filter((id) => id !== memberId)
      }
    }
  });

  return updatedOrg;
};

// server action/organization.ts


export const getAllOrgWithMembers = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("User not found");

  // Get organizations where user is admin or member
  const organizations = await db.organization.findMany({
    where: {
      OR: [
        { adminId: user.id },
        { members: { has: user.id } },
      ],
    },
  });

  if(organizations.length===0)return []

  // For each org, fetch full member details
  const organizationsWithMembers = await Promise.all(
    organizations.map(async (org) => {
      const memberDetails = await db.user.findMany({
        where: {
          id: { in: org.members },
        }
      });

      return {
        ...org,
        members: memberDetails, // replaces ID array with actual user data
      };
    })
  );

  return organizationsWithMembers;
};
