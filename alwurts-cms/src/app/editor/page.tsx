import { Button, buttonVariants } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { getPosts } from "@/server-actions/post";
import dynamic from "next/dynamic";
import Link from "next/link";
import CreateButton from "./components/CreateButton";

const PostCard = dynamic(() => import("./components/PostCard"), { ssr: false });

export default async function CMSPostsPage() {
	const posts = await getPosts();

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">CMS Posts</h1>
			<div className="mb-6 flex space-x-4">
				<CreateButton />
			</div>
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}
