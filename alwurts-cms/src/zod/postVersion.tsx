import { z } from "zod";

export const PostVersionSchema = z.object({
	publish: z.string().optional(),
	postId: z.string(),
	url: z.string().min(2).max(50),
	links: z
		.array(
			z.object({
				title: z.string(),
				url: z.string().url(),
			}),
		)
		.or(z.string())
		.nullable().optional(),
	title: z.string().min(2).max(50),
	description: z.string().min(2).max(200),
	content: z.string(),
	author: z.string().min(2).max(50),
	date: z.date().or(z.string()),
	tags: z.string(),
	imageLarge: z.instanceof(File).optional(),
	imageLargeDescription: z.string().optional(),
	imageSmall: z.instanceof(File).optional(),
	imageSmallDescription: z.string().optional(),
});

export type ZPostVersion = z.infer<typeof PostVersionSchema>;
