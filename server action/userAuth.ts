import { auth } from "@clerk/nextjs/dist/types/server";

export const userAuth=async ()=>{
    const {userId}=await auth();
    if(!userId) throw new Error("User not authenticated");
    else return userId;
}