"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import RemoveMember from "./removeMember"
import { useContextProvider } from "@/context/context"
import { useFetch } from "@/hook/useFetch"
import AdminMember from "./adminMember"
import { Skeleton } from "./ui/skeleton"

export const ManageMember = () => {
  const [open, setOpen] = useState(false);
  const { org, setOrg, orgMembers } = useContextProvider();
  const [users, setUser] = useState([]);
  const { post } = useFetch();
  const getUserHandeler = async (email: string) => {
    if (email.length < 1) return;
    const usersResp = await post('/api/user/getUserByEmail', "POST", { email })
    if (usersResp) {
      setUser((prev) => usersResp.users.filter((u) => orgMembers.every((m) => u.id != m.id)))
    }
  }
  const addMemberToOrg = async (id: string) => {
    const updadtedOrg = await post('/api/organization/upate/add', "POST", { orgId: org.id, memberId: id });
    if (updadtedOrg) setOrg(updadtedOrg.org)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-[200px]"
        >
          Add Members
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput onValueChange={(val) => getUserHandeler(val)} placeholder="Search members..." className="h-9" />
          <CommandList>
            <div key={crypto.randomUUID()} className="mt-2 px-2">
              {
                users && users.map((u) => orgMembers.every((m) => m.id != u.id) ? <div key={u.id} className="flex justify-between px-2 py-2   rounded-md hover:bg-slate-800">
                  <div className="flex gap-3">
                    <img src={u.imgUrl} alt="" className="h-6 w-6 rounded-full" />
                    <div className="text-sm">{u.email}</div>
                  </div>
                  <div>
                    <Button className="text-sm" size="sm" onClick={() => addMemberToOrg(u.id)}>add</Button>
                  </div>
                </div> : null)
              }
            </div>
          </CommandList>
          <CommandList>
            {
              !org || !orgMembers ?
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                :
                <div className="px-2 py-1">
                  {orgMembers.length > 0 ? <div className="text-sm text-gray-400">Members</div> : <></>}
                  {orgMembers.map((m) => m.id === org.adminId ? <AdminMember key={m.id} id={m.id} /> : <RemoveMember key={m.id} id={m.id} />)}
                </div>
            }
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}