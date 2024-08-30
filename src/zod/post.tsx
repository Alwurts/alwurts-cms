import { z } from "zod";

export const PostEditorFormSchema = z.object({
	postId: z.string(),
	url: z.string().min(2).max(50),
	links: z.string().optional(),
	tags: z.string().optional(),
	title: z.string().min(2).max(50),
	description: z.string().min(2).max(200),
	content: z.string(),
	author: z.string().min(2).max(50),
	date: z.string(),
	imageLarge: z.any().optional(),
	imageLargeDescription: z.string().optional(),
	imageSmall: z.any().optional(),
	imageSmallDescription: z.string().optional(),
});
