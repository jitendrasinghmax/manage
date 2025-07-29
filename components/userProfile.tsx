import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { currentUser } from '@clerk/nextjs/server'
import { Avatar, AvatarImage } from "./ui/avatar";
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuShortcut,
} from "./ui/dropdown-menu";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";


const UserProfile = async () => {
    const user = await currentUser();
    if (!user) return <SignInButton><Button>Sign In</Button></SignInButton>
    else return <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={user.imageUrl} />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href={`/myorganization`}>
                        my organization
                        </Link>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    
                </DropdownMenuGroup>
               
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <SignOutButton>log out</SignOutButton>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

}
export default UserProfile;     
