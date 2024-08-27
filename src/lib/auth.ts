import { auth } from "@/auth";
import type { AuthenticatedSession } from "@/auth.config";

export const withAuthCheck = <TProps extends unknown[], TResult>(
	handler: (
		session: AuthenticatedSession,
		...props: TProps
	) => Promise<TResult>,
) => {
	return async (...props: TProps): Promise<TResult | null> => {
		const session = await auth();

		if (!session || !session.user?.id) {
			throw new Error("Unauthorized");
		}
		const user = session.user;

		return handler(
			{
				...session,
				user: {
					...user,
					id: session.user.id,
				},
			},
			...props,
		);
	};
};