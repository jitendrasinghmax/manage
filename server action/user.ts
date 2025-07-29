import { currentUser } from "@clerk/nextjs/server"

import { db } from "../lib/prisma";

export const getUser = async () => {
    const clerkUser = await currentUser();
    if(!clerkUser)throw new Error("User not authenticated");
    const user = await db.user.findUnique({
        where: {
            clerkId: clerkUser.id,
        },
    });
    if(!user) {
        throw new Error("User not found");
    }
    return user;
}

export const createUser=async()=>{
   const user=await currentUser();
   if(!user)return null;
    try{
        const loggedInUser=await db.user.findUnique({
            where:{
                clerkId:user.id,
            }
        })
        if(!loggedInUser){
            await db.user.create({
                data:{
                    clerkId:user.id,
                    name:user.firstName,
                    email:user.emailAddresses[0].emailAddress,
                    imgUrl:user.imageUrl
                }
            })
        }
        else return null;
    }
    catch(e){
        throw new Error("an arror occur while cheacking user");
    }
}
export const getUsersByEmail=async(email:string)=>{
    const user=await currentUser();
    if(!user)return null;
    try{
        const users=await db.user.findMany({
            where:{
                email:{
                    contains:email,
                    mode:"insensitive"
                }
            }
        })
        if(!users)throw new Error("n error while geting user");
        const valid_user=users.filter((u)=>u.email!=user.emailAddresses[0].emailAddress)
        return valid_user;
    }
    catch(e){
        throw new Error((e as Error).message);
    }
}
export const getUserById=async (id:string)=>{
 const clerkUser=await currentUser();
    if(!clerkUser)throw new Error("user not authticated");
    try{
        const user=await db.user.findUnique({
            where:{
                id
            }
        })
        
        if(!user){
            console.log("id:",id)
            throw new Error("n error while geting user");
        }
        return user;
    }
    catch(e){
        throw new Error((e as Error).message);
    }
}