"use client";

import { useContextProvider } from "@/context/context";
import { CalendarDays, UserRound } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetch } from "@/hook/useFetch";
import Status from "@/components/updateProject/status";
import EditMember from "@/components/updateProject/editMember";
import { CreateTaskDialog } from "@/components/createTask";
import { CardContainer } from "@/components/card/task/cardsContainer";
import { Separator } from "@/components/ui/separator";

export default function ProjectWorkspace() {
  const parms = useParams();
  const { org, setOrg, projects, orgMembers } = useContextProvider();
  const [membersData, setMembersData] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const router = useRouter();
  const { post } = useFetch();
  const projectId = parms.projectId as string;

  useEffect(() => {
    if (!org) {
      const loadOrg = async () => {
        const projectResp = await post('/api/project/get/getProjectById', "POST", { id: projectId })
        if (projectResp) {
          const orgResp = await post('/api/organization/get', "POST", { orgId: projectResp.project.organization })
          if (orgResp) setOrg(orgResp.org);
        }
        else {
          router.push('/myorganization')
        }
      }
      loadOrg()
    }
  }, [])

  useEffect(() => {
    if (projects) setCurrentProject(projects.find((m) => m.id == projectId))
  }, [projects])

  useEffect(() => {
    if (currentProject && orgMembers) {
      setMembersData(currentProject.members.map((id) =>
        orgMembers?.find((member) => member.id === id)))
    }
  },
    [currentProject, orgMembers])

  if (!projects||!orgMembers) {
    return (
      <div className="text-muted-foreground text-center mt-10">
        loading...
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="text-muted-foreground text-center mt-10">
        Project not found.
      </div>
    );
  }
  return (
    <div className="w-full h-full mt-5">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-5xl font-bold">{currentProject.name}</h1>
          <p className="text-muted-foreground">{currentProject.desc}</p>
        </div>
        <Status currentProject={currentProject} setCurrentProject={setCurrentProject} />
      </div>

      {/* Details Section */}
      <div className="flex justify-between items-center gap-4 flex-wrap border rounded-lg p-4 bg-muted/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays size={16} />
          Deadline: <strong>{format(new Date(currentProject.deadline), "dd MMM yyyy")}</strong>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserRound size={16} />
          Team:{" "}
          <div className="flex -space-x-3">
            {membersData.map(
              (member) =>
                member && (
                  <Image
                    key={member.id}
                    src={member.imgUrl}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-white"
                  />
                )
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <Button variant="outline">Edit Project</Button>
      </div>

      {/* (Optional) Sections */}
      {/* Add tabs or accordions for: Tasks, Files, Updates, etc. */}
      <div className=" w-full  flex flex-col-reverse  md:flex-row  mt-5 gap-x-5">
        <div className="shadow-md w-full md:w-[60%] lg:w-[75%]">
          {/*task cards*/}
          <CardContainer projectId={projectId}/>
        </div>
        <div className="h-fit flex-1 ">
          <EditMember currentProject={currentProject} setCurrentProject={setCurrentProject}/>
        </div>
      </div>
    </div>
  );
}
