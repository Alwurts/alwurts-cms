import Google from "next-auth/providers/google";
import type { Session, NextAuthConfig } from "next-auth"

// Parse allowed emails from environment variable
const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map(email => email.trim()) || [];

export type AuthenticatedSession = Session & {
	user: NonNullable<Session["user"]> & { id: string };
};

export default {
	providers: [Google],
	session: { strategy: "jwt" },
	callbacks: {
		async signIn({ user }) {
			// Check if the user's email is in the allowed list
			return allowedEmails.includes(user.email?.toLowerCase() || '');
		},
		async jwt({ token, user }) {
			if (user) {
				token.user_id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.user_id as string;
			return session;
		},
	},
	pages: {
		signIn: "/editor/login",
	},
	debug: false,
} satisfies NextAuthConfig;
