import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getAllOrgWithMembers } from "@/server action/organization";
import Link from "next/link";

export default async function OrgList() {
  const orgs = await getAllOrgWithMembers();
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orgs.map((org) => (
        <Link href={`organization/${org.slug}`} >
          <Card key={org.id} className="relative border border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{org.name}</CardTitle>
              <p className="text-sm text-gray-400">{org.desc}</p>
            </CardHeader>

            <CardContent className="relative">
              {/* Members - Right bottom corner */}
              <div className="absolute bottom-3 right-3 flex -space-x-3">
                {org.members.slice(0, 5).map((member) => (
                  <Image
                    key={member.id}
                    src={member.imgUrl}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white shadow-md"
                  />
                ))}
                {org.members.length > 5 && (
                  <div className="w-10 h-10 rounded-full bg-gray-700 text-sm flex items-center justify-center border-2 border-white">
                    +{org.members.length - 5}
                  </div>
                )}
              </div>
            </CardContent>
          </Card></Link>
        ))}
      </div>
    
  );
}
