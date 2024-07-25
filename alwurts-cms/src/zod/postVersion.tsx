import { z } from "zod";

export const PostVersionSchema = z.object({
	postId: z.string(),
	title: z.string().min(2).max(50),
	description: z.string().min(2).max(50),
	content: z.string(),
	author: z.string().min(2).max(50),
	date: z.date().or(z.string()),
	tags: z.string(),
	imageLarge: z.instanceof(File).optional(),
	imageSmall: z.instanceof(File).optional(),
});

export type ZPostVersion = z.infer<typeof PostVersionSchema>;