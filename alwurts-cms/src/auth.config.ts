import Google from "next-auth/providers/google";
import type { Session, NextAuthConfig } from "next-auth"

export type AuthenticatedSession = Session & {
	user: NonNullable<Session["user"]> & { id: string };
};

export default {
	providers: [Google],
	session: { strategy: "jwt" },
	callbacks: {
		async jwt({ token, user }) {
			/* if (user) {
				token.user_id = user.id;
			} */
			return token;
		},
		async session({ session, token }) {
			/* session.user.id = token.user_id as string; */
			return session;
		},
	},
	pages: {
		signIn: "/editor/login",
	},
	debug: false,
} satisfies NextAuthConfig;
