"use client"

import { Provider } from "@/context/context"

export default function({children}:{children:React.ReactNode}){
    return <Provider>{children}</Provider>
}