"use client";

import { useContextProvider } from "@/context/context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const ProjectCard = () => {
  const { projects, orgMembers } = useContextProvider();

  if (!projects) {
    return <div className="flex-1  w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {[1,2,3,4,6,6,7,8,9].map(()=>{
        return <div className="border-4  rounded-lg"><Skeleton className="bg-gray-300/20 h-full w-full"/></div>
      })}
    </div>
  }
  if(projects.length==0){
    return <div className="text-5xl font-extrabold text-center pt-10">NO PROJETS</div>
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-gray-200 text-gray-800";
      case "IN_PROGRESS":
        return "bg-yellow-200 text-yellow-800";
      case "DONE":
        return "bg-green-200 text-green-800";
      default:
        return "bg-muted text-foreground";
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {projects.map((project) => (
        <Link href={`/project/${project.id}`}>
        <Card
          key={project.id}
          className="bg-background/60 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between relative"
        >
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace("_", " ")}
            </Badge>
          </div>

          <CardHeader>
            <div className="text-xl font-bold text-primary">{project.name}</div>
            <div className="text-sm text-muted-foreground mt-1 line-clamp-3">{project.desc}</div>
          </CardHeader>

          <CardContent className="mt-4 flex flex-col gap-4">
            {/* Deadline */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              {project.deadline ? format(new Date(project.deadline), "dd MMM yyyy") : "No deadline"}
            </div>

            {/* Members */}
            <div className="flex justify-end mt-auto">
              <div className="flex -space-x-3">
                {project.members?.map((id: string) => {
                  const user = orgMembers?.find((u) => u.id === id);
                  return user ? (
                    <Image
                      key={id}
                      src={user.imgUrl}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-background"
                    />
                  ) : null;
                })}
              </div>
            </div>
          </CardContent>
        </Card></Link>
      ))}
    </div>
  );
};
