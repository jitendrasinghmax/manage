'use client'
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useFetch } from "@/hook/useFetch"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"

export function CreateOrg() {
    const [inputData, setInputData] = useState({
        name: "",
        desc: "",
        slug: "",
        members: []
    })
    const [members,setMembers]=useState([]);

    const [users, setUsers] = useState([]);
    const {post} = useFetch();
    const router = useRouter();
    const createOrgHandeler = async () => {
        try{
            const org = await post("/api/organization/create", "POST", inputData)
             if (org) {
            console.log(org)
            router.push(`/organization/${org.org.slug}`)
        }
        }
        catch(e){

        }
        finally{

        }
    }
    const getUser = async (email) => {
        const resp = await post('/api/user/getUserByEmail', "POST", { email });
        setUsers(() => resp.users.filter((user) => inputData.members.every((m) => m != user.id)));
    }
    interface InputHandlerEvent extends React.ChangeEvent<HTMLInputElement> { }

    const inputHandeler = (e: InputHandlerEvent): void => {
        const { name, value } = e.target;
        setInputData((prev) => {
            return { ...prev, [name]: value };
        })
    }
    useEffect(()=>{
        setInputData((prev)=>({...prev,members:members.map((m)=>m.id)}))
    },[members])
    return <div className="w-1/3 mt-16">
       
        <Card className="">
            <CardHeader className="">
                <CardTitle className="mx-auto text-xl font-bold">Create organization</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-2">
                <Input name="name" value={inputData.name} placeholder="Name" onChange={inputHandeler}></Input>
                <Input name="desc" value={inputData.desc} placeholder="Description" onChange={inputHandeler}></Input>
                <Input name="slug" value={inputData.slug} placeholder="slug" onChange={inputHandeler}></Input>
                <Command>
                    <CommandInput
                        placeholder="Search members..."
                        onValueChange={(val) => getUser(val)}
                    />
                    <CommandList>
                            {users && users.length > 0 && users.map((u) => {
                                const isNotMember=members.every((m)=>m.id!=u.id);
                                if(isNotMember===false)return<></>
                                return <div className="w-full p-2 rounded-lg border-2 my-1 hover:bg-gray-700  flex justify-between gap-x-5" key={u.id}>
                                    <div className="flex gap-x-6">
                                        <img src={u.imgUrl} alt="" className="h-6 w-6 rounded-full"></img>
                                    <p>{u.name}</p>
                                    </div>
                                    <Button className="h-6" onClick={()=>setMembers((prev)=>([...prev,u]))}>Add</Button>
                                </div>
                            })}
                    </CommandList>
                    <CommandList>
                        {members.length>0?<div className="text-sm text-gray-400">Members</div>:<></>}
                        {members.map((u)=>{
                            return  <div className="w-full p-2 rounded-lg border-2 my-1 hover:bg-gray-700  flex justify-between gap-x-5" key={u.id}>
                                    <div className="flex gap-x-6">
                                        <img src={u.imgUrl} alt="" className="h-6 w-6 rounded-full"></img>
                                    <p>{u.name}</p>
                                    </div>
                                    <Button className="h-6" onClick={()=>setMembers((prev)=>prev.filter((m)=>m.id!=u.id))}>remove</Button>
                                </div>
                        })}
                    </CommandList>
                </Command>

                <Button onClick={createOrgHandeler} className="w-full">Create</Button>
            </CardContent>
        </Card>
    </div>
}