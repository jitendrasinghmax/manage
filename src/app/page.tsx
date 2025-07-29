import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    title: "Intuitive Kanban Boards",
    description:
      "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
  },
  {
    title: "Powerful Sprint Planning",
    description:
      "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Gain insights into your team's performance with detailed, customizable reports and analytics.",
  },
];

export default async function Home() {
  return (
    <>
     <div className="w-full flex  flex-col justify-center items-center mt-20 gap-y-5">
      <div className="w-fit text-8xl font-extrabold text-gray-200  p-5 text-center">PROJECT TRACKER</div>
      <div>
        <Link href='/onboading'>
          <Button>Get Started</Button>
        </Link>
        <Link href="#fetures">
          <Button className="ml-4 active:bg-gray-500">Learn More</Button>
        </Link>
      </div>
      <section id="fetuers" className="flex flex-col justify-center gap-y-10 p-10   ">
        <div className="text-center text-4xl">Key Features </div>
        <div className="grid grid-col-1 md:grid-cols-3 gap-4">{features.map((item,index)=>{
          return <Card key={index} className="backdrop-blur bg-white/10">
            <CardHeader className="text-center text-2xl font-bold">{item.title}</CardHeader>
            <CardContent className="text-center">{item.description}</CardContent>
          </Card>
        })}</div>
      </section>
    </div>
    </>
  );
}
