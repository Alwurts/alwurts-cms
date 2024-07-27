import Link from "next/link";
import { buttonVariants } from "../components/ui/button";
import Image from "next/image";
import { getPublishedPosts } from "@/server-actions/post";

export const revalidate = 60;

export default async function Home() {
	const posts = await getPublishedPosts();
	return (
		<div className="max-w-5xl mx-auto text-xl">
			<section className="flex flex-col items-center w-full space-y-12 mt-10 px-6">
				<div className="space-y-6 text-center">
					<h2 className="text-6xl font-bold">Projects</h2>
				</div>
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
			</section>
		</div>
	);
}
