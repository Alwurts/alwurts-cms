export const dynamic = "force-dynamic";
export const revalidate = 60 * 60 * 24;

import { getPublishedPosts } from "@/server-actions/post";
import type { MetadataRoute } from "next";

const HOST_URL = process.env.HOST_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const data = await getPublishedPosts();

	const blogEntries: MetadataRoute.Sitemap = data.map((post) => ({
		url: `${HOST_URL}/${post.url}`,
		lastModified: post.date,
	}));

	return [
		{
			url: `${HOST_URL}/`,
			lastModified: "2024-07-10",
		},
		{
			url: `${HOST_URL}/projects`,
			lastModified: "2024-07-10",
		},
		...blogEntries,
	];
}
