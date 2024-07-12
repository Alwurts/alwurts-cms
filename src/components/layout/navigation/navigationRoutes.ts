import { Globe2Icon, Home, PencilIcon, ThumbsUp, User, XCircleIcon } from "lucide-react";

export const navigationRoutes = [
	{
		title: "Homepage",
		icon: Globe2Icon,
		href: "/",
	},
	{
		title: "Editor",
		icon: PencilIcon,
		href: "/editor",
	},
];

export type NavigationRoute = typeof navigationRoutes[number];
