"use server";

import { signIn as signInAuth, signOut as signOutAuth } from "@/auth";

export async function signIn() {
	await signInAuth("google", { redirectTo: "/editor" });
}

export async function signOut() {
	await signOutAuth({
		redirectTo: "/",
	});
}
