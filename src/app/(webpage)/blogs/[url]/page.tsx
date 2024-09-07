import { GithubIcon } from "@/components/icons/GithubIcon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getPublishedPostByUrl } from "@/server-actions/post";
import { linksSchema } from "@/zod/postLinks";
import { GlobeIcon, LinkIcon, TagIcon } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypeHighlight from "rehype-highlight";
import "@/styles/code-highlight.css";
import type { Metadata, ResolvingMetadata } from "next";

function LinkPanel({ links }: { links: unknown }) {
	const linksParsed = linksSchema.parse(
		typeof links === "string" ? JSON.parse(links) : links,
	);

	if (!linksParsed) {
		return null;
	}

	return (
		<div className="ml-1 flex items-center space-x-2">
			{linksParsed?.map((link) => (
				<div key={link.url} className="flex items-center space-x-1">
					{link.title.toLowerCase() === "github" && (
						<Link
							href={link.url}
							target="_blank"
							className={cn(
								buttonVariants({
									variant: "link",
									size: "sm",
								}),
								"flex items-center space-x-1 px-1 h-7",
							)}
						>
							<GithubIcon className="w-6 h-6" />
							<span>{getGithubRepoName(link.url)}</span>
						</Link>
					)}
					{link.title.toLowerCase() === "live" && (
						<Link
							href={link.url}
							target="_blank"
							className={cn(
								buttonVariants({
									variant: "link",
									size: "sm",
								}),
								"flex items-center space-x-1 px-1 h-7",
							)}
						>
							<GlobeIcon className="w-5 h-5" />
							<span>{removeHttps(link.url)}</span>
						</Link>
					)}
					{!["github", "live"].includes(link.title.toLowerCase()) && (
						<Link
							href={link.url}
							target="_blank"
							className={cn(
								buttonVariants({
									variant: "link",
									size: "sm",
								}),
								"flex items-center space-x-1 px-1 h-7",
							)}
						>
							<LinkIcon className="w-5 h-5" />
							<span>{removeHttps(link.url)}</span>
						</Link>
					)}
				</div>
			))}
		</div>
	);
}

// Helper function to extract GitHub repo name from URL
function getGithubRepoName(url: string): string {
	const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
	return match ? match[1] : url;
}

function removeHttps(url: string): string {
	return url.replace(/^https?:\/\//, "");
}

export async function generateMetadata({
	params,
}: { params: { url: string } }): Promise<Metadata> {
	// read route params
	const url = params.url;

	// fetch data
	const post = await getPublishedPostByUrl(url);
	if (!post) {
		return {
			title: "Not found",
		};
	}

	return {
		title: post.title,
		description: post.description,
		authors: {
			name: "Alwurts",
			url: "https://alwurts.com",
		},
		openGraph: {
			images: [post.imageSmall?.url || ""],
		},
	};
}

export default async function Page({ params }: { params: { url: string } }) {
	const post = await getPublishedPostByUrl(params.url);
	if (!post) {
		return <div>Not found</div>;
	}

	return (
		<div className="max-w-4xl mx-auto py-8 px-6 space-y-7 flex flex-col items-stretch">
			<div className="space-y-2">
				<h1 className="text-5xl font-bold">{post.title}</h1>
				<p className="ml-2 text-muted-foreground-alwurts">
					{new Date(post.date).toLocaleDateString()}
				</p>
				<div className="ml-2 flex items-center space-x-2 text-sm">
					<TagIcon className="w-5 h-5" />
					{post.tags.map((tag) => (
						<Badge key={tag.tagName} variant="default" className="text-sm">
							{tag.tagName}
						</Badge>
					))}
				</div>
				<LinkPanel links={post.links} />
			</div>
			<Separator />
			<div className="prose max-w-none lg:prose-lg dark:prose-invert prose-headings:mb-5 dark:prose-pre:bg-zinc-800">
				<MDXRemote
					source={post.content}
					options={{
						mdxOptions: {
							rehypePlugins: [rehypeHighlight],
						},
					}}
				/>
			</div>
		</div>
	);
}
