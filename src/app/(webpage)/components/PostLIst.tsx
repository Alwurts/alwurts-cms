import Link from "next/link";
import Image from "next/image";
import type { TPost } from "@/types/database/post";

export default async function PostsLists({
	posts,
	postType,
}: {
	posts: NonNullable<TPost["publishedVersion"]>[];
	postType: TPost["type"];
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-6 w-full mt-8 md:px-20 lg:px-44 xl:px-0">
			{posts.map((publishedVersion) => {
				return (
					<Link
						href={`/${postType}s/${publishedVersion.url}`}
						key={publishedVersion.postId}
						className="border-[3px] border-input-alwurts rounded-[40px] bg-background-alwurts text-card-foreground hover:bg-accent-alwurts transition-transform hover:scale-[97%]"
					>
						<div className="p-6">
							{publishedVersion.imageSmall?.url && (
								<Image
									src={publishedVersion.imageSmall.url}
									alt={publishedVersion.title}
									width={250}
									height={250}
									className="object-contain h-auto w-[250px] mb-4 mx-auto"
								/>
							)}
							<h3 className="text-2xl font-bold">{publishedVersion.title}</h3>
							<h4 className="text-lg text-primary-alwurts">
								{new Date(publishedVersion.date).toLocaleDateString()}
							</h4>
							<p>
								{publishedVersion.description.length > 100
									? `${publishedVersion.description.substring(0, 100)}...`
									: publishedVersion.description}
							</p>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
