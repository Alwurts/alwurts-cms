export const dynamic = "force-dynamic";
export const revalidate = 60 * 60 * 24;

import { getPublishedBlogs, getPublishedProjects } from "@/server-actions/post";
import type { MetadataRoute } from "next";

const HOST_URL = process.env.HOST_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const projectData = await getPublishedProjects();
	const blogData = await getPublishedBlogs();

	const projectEntries: MetadataRoute.Sitemap = projectData.map((post) => ({
		url: `${HOST_URL}/projects/${post.url}`,
		lastModified: post.date,
	}));

	const newestProjectDate = projectData.reduce((acc, post) => {
		return post.date > acc ? post.date : acc;
	}, new Date());

	const newestBlogDate = blogData.reduce((acc, post) => {
		return post.date > acc ? post.date : acc;
	}, new Date());

	const blogEntries: MetadataRoute.Sitemap = blogData.map((post) => ({
		url: `${HOST_URL}/blogs/${post.url}`,
		lastModified: post.date,
	}));

	return [
		{
			url: `${HOST_URL}/`,
			lastModified: newestProjectDate,
		},
		{
			url: `${HOST_URL}/projects`,
			lastModified: newestProjectDate,
		},
		{
			url: `${HOST_URL}/blogs`,
			lastModified: newestBlogDate,
		},
		...projectEntries,
		...blogEntries,
	];
}
