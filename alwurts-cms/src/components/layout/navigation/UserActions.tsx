import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { auth } from "@/auth";
import { signOut } from "@/server-actions/auth";

export async function UserActions() {
	const authSession = await auth();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className="overflow-hidden rounded-full ml-auto"
				>
					<Image
						src={authSession?.user?.image || "/placeholder-user.jpg"}
						width={36}
						height={36}
						alt="Avatar"
						className="overflow-hidden rounded-full"
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>Settings</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="p-0" asChild>
					<form className="w-full" action={signOut}>
						<Button
							className="w-full py-1 h-8 justify-start"
							size="sm"
							variant="ghost"
							type="submit"
						>
							Logout
						</Button>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
