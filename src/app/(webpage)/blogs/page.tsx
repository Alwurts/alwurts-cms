export const dynamic = "force-dynamic";

import MainLoader from "@/components/skeleton/MainLoader";
import { Suspense } from "react";
import { PostsList } from "../components/PostsList";
import { getPublishedBlogs } from "@/server-actions/post";

export default async function Blog() {
	const posts = await getPublishedBlogs();

	return (
		<div className="max-w-5xl mx-auto text-xl">
			<section className="flex flex-col items-center w-full space-y-12 mt-10 px-6">
				<div className="space-y-6 text-center">
					<h2 className="text-6xl font-bold">Blog</h2>
				</div>
				<Suspense fallback={<MainLoader />}>
					<PostsList posts={posts} postType="blog" />
				</Suspense>
			</section>
		</div>
	);
}
