import { getPosts } from "@/server-actions/post";
import CreateButton from "./components/CreateButton";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const PostCard = dynamic(() => import("./components/PostCard"), {
	loading: () => <Skeleton className="w-full h-[300px]" />,
	ssr: false,
});

export default async function CMSPostsPage() {
	const posts = await getPosts();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">CMS Posts</h1>
			<div className="mb-6 flex space-x-4">
				<CreateButton />
			</div>
			<div className="flex flex-col space-y-6">
				{posts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</div>
	);
}
