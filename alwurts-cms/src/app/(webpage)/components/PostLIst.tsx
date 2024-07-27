export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/server-actions/post";

export default async function Posts() {
	const posts = await getPublishedPosts();
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-6 w-full mt-8 md:px-20 lg:px-44 xl:px-0">
			{posts.slice(0, 4).map((post) => (
				<Link
					href={`/projects/${post.url}`}
					key={post.postId}
					className="border-[3px] border-input-alwurts rounded-[40px] bg-background-alwurts text-card-foreground hover:bg-accent-alwurts transition-transform hover:scale-[97%]"
				>
					<div className="p-6">
						{post.imageSmall?.url && (
							<Image
								src={post.imageSmall.url}
								alt={post.title}
								width={250}
								height={250}
								className="object-contain h-auto w-[250px] mb-4 mx-auto"
							/>
						)}
						<h3 className="text-2xl font-bold">{post.title}</h3>
						<h4 className="text-lg text-primary-alwurts">
							{new Date(post.date).toLocaleDateString()}
						</h4>
						<p>
							{post.description.length > 100
								? `${post.description.substring(0, 100)}...`
								: post.description}
						</p>
					</div>
				</Link>
			))}
		</div>
	);
}
