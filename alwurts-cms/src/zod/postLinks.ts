import { z } from "zod";

export const linkSchema = z.object({
	title: z.string().min(1, "Title is required"),
	url: z.string().url("Invalid URL"),
});

export const linksSchema = z.array(linkSchema).nullable();

export type Link = z.infer<typeof linkSchema>;
