import ProviderWrapper from "@/components/provider-wrapper";

export default function ({children}){
    return <div className="h-screen p-8"><ProviderWrapper>{children}</ProviderWrapper></div>
}