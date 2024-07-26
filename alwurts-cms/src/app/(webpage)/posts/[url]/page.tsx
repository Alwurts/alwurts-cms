import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPublishedPostByUrl } from "@/server-actions/post";
import { TagIcon } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Page({ params }: { params: { url: string } }) {
	const post = await getPublishedPostByUrl(params.url);
	if (!post) {
		return <div>Not found</div>;
	}

	return (
		<div className="max-w-4xl mx-auto py-8 space-y-4">
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
			</div>
			<Separator />
			<div /* style={{ lineHeight: "1.5rem" }} */
				className="prose lg:prose-lg dark:prose-invert prose-headings:mb-5"
			>
				<MDXRemote source={post.content} />
			</div>
		</div>
	);
}
