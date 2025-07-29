import { createUser } from "@/server action/user";
import UserProfile from "./userProfile";

const Header=async()=>{
    await createUser();
    return <div className="flex justify-between">
        <div>Logo</div>
        <div><UserProfile/></div>
    </div>
}
export default Header;