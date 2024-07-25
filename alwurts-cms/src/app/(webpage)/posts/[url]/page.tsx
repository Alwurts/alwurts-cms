import { getPublishedPostByUrl } from "@/server-actions/post";

export default async function Page({ params }: { params: { url: string } }) {
	const post = await getPublishedPostByUrl(params.url);
	return (
		<div className="max-w-5xl mx-auto">
			My Post: {params.url}
			<p>{post?.content}</p>
		</div>
	);
}
