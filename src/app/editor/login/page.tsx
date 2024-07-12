import { auth } from "@/auth";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/server-actions/auth";
import Link from "next/link";

export default async function Signin() {
	const authSession = await auth();
	return (
		<main className="flex items-center justify-center h-screen">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>Login to SaaS App</CardDescription>
				</CardHeader>
				<CardFooter>
					{authSession ? (
						<div className="space-y-4">
							<p>You are already signed in</p>

							<Link
								className={buttonVariants({
									variant: "default",
									size: "lg",
								})}
								href="/app"
							>
								Go to dashboard
							</Link>
						</div>
					) : (
						<form action={signIn}>
							<Button type="submit" className="w-full">
								Sign in <GoogleIcon className="ml-2 text-white" />
							</Button>
						</form>
					)}
				</CardFooter>
			</Card>
		</main>
	);
}
