import Editor from "./components/Editor";
import { getPostById } from "@/server-actions/post";

export default async function EditorPage({
	params,
}: { params: { id: string } }) {
	const postData = await getPostById(params.id);

	if (!postData?.latestVersion) {
		return <div className="p-4">Post not found</div>;
	}

	return <Editor post={postData} />;
}
