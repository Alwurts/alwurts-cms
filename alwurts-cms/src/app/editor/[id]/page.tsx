import { CardLayout } from "@/components/layout/CardLayout";
import { getPost } from "@/server-actions/post";
import Editor from "./components/Editor";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

export default async function EditorPage({
	params,
}: { params: { id: string } }) {
	const post = await getPost(params.id);

	if (!post) {
		return <div className="p-4">Post not found</div>;
	}

	return <Editor post={post} />;
}
