"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { ManageMember } from "@/components/ManageMembers";
import { CreateProject } from "@/components/createProject";
import { useFetch } from "@/hook/useFetch";
import { useContextProvider } from "@/context/context";
import { ProjectCard } from "@/components/card/project/projectCard";
import { Separator } from "@/components/ui/separator";

export default function OrganizationPage() {
  const { orgId } = useParams<{ orgId: string }>();
  const { post } = useFetch();
  const { org, setOrg } = useContextProvider();
  const [openDiolog,setOpenDialog]=useState(false);

  const getOrganizationHandler = async () => {
    const orgResp = await post(`/api/organization/get`, "POST", { orgId });
    if (orgResp) setOrg(orgResp.org);
  };

  useEffect(() => {
    getOrganizationHandler();
  }, []);

  if (!org) return null;

  return (
    <div className="min-h-screen py-10 px-4 flex flex-col">
      <div className="max-w-3xl mx-auto bg-background border rounded-xl p-6 shadow-sm text-foreground space-y-6">
        <h1 className="text-center text-3xl font-bold">{org.name}&apos;s Organization</h1>

        <div className="flex flex-wrap justify-center gap-4">
          <ManageMember />

          <Dialog open={openDiolog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-[200px]">
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create Project</DialogTitle>

                    <CreateProject onSucess={()=>setOpenDialog(false)} />

              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 flex flex-col w-full">
        <Separator className="mt-2 "/>
        <ProjectCard/>
      </div>
    </div>
  );
}
