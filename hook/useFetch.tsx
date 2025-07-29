import { toast } from "sonner";

export const useFetch = () => {
    
    const post = async (url: string, method: "GET" | "POST", body: any) => {
        try {
            const result = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(body)
            })
            if (result.ok) {
                const data = await result.json();
                return data;
            }
            else{
                if(result){
                    const errorData = await result.json();
                    console.log(errorData)
                    if(errorData.msg)throw new Error(errorData.msg);
                }
                throw new Error("Failed to fetch data");
            }
        }
        catch(e){
            toast((e as Error).message)
        }
    }
    return { post }
}