"use client"
import { useFetch } from "@/hook/useFetch";
import { createContext, useContext, useEffect, useState } from "react";

const Context = createContext(null);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [org, setOrg] = useState(null);
  const [orgMembers,setOrgMembers]=useState(null);
  const [user,setUser]=useState(null);
  const [projects,setProjects]=useState(null);
  //const [me,setMe]=useState(null);
  const {post}=useFetch();
  useEffect(() => {
    if (!org?.members || org.members.length === 0) return;

    const fetchMembers = async () => {
      const results = await Promise.allSettled(
        org.members.map(async (memberId) => {
        
            const userResp=await post("/api/user/getUserById","POST",{id:memberId});
            if(!userResp) return null
            return userResp.user;
          
        })
      );

      const fulfilled = results
        .filter((res): res is PromiseFulfilledResult<any> => res.status === "fulfilled" && (res as PromiseFulfilledResult<any>).value)
        .map((res) => res.value);

      setOrgMembers(fulfilled);
    };

    fetchMembers();
  }, [org]);
  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const userResp = await post("/api/user/getUser","POST",{});
        if(userResp) setUser(userResp.user);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
    const fetchProjects=async()=>{
      const projectsResp=await post("/api/project/get/getAllProject","POST",{orgId:org.id});
      if(projectsResp) setProjects(projectsResp.projects);
    }
    
    if(org)fetchProjects();
  },[org])
  return (
    <Context.Provider value={{user, org, setOrg ,orgMembers,setOrgMembers,projects,setProjects}}>
      {children}
    </Context.Provider>
  );
};

export const useContextProvider = () => useContext(Context);
