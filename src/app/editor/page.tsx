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
			<div className="mb-6">
				<CreateButton />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
				{posts?.map((post) => (
					<div key={post.id} className="grid">
						<PostCard post={post} />
					</div>
				))}
			</div>
		</div>
	);
}
