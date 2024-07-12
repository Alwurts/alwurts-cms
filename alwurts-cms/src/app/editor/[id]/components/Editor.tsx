"use client";

import { CardLayout } from "@/components/layout/CardLayout";
import { Button } from "@/components/ui/button";
import type { TPost } from "@/types/database/post";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { SaveIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useRef } from "react";

const MDXEditor = dynamic(() => import("@/components/MDXEditor"), {
	ssr: false,
});

export default function Editor({ post }: { post: TPost }) {
	const editorRef = useRef<MDXEditorMethods>(null);

	const onSave = () => {
		const content = editorRef.current?.getMarkdown();
		console.log("content", content);
	};
	return (
		<CardLayout
			cardHeaderContent={{
				title: post.title,
				description: `Editing post ${post.id}`,
			}}
			classname="max-w-6xl mx-auto"
			layoutTools={
				<div className="space-x-2">
					<Button onClick={onSave} className="flex space-x-1">
						<SaveIcon className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							Save
						</span>
					</Button>
				</div>
			}
		>
			<MDXEditor editorRef={editorRef} markdown={post.content} />
		</CardLayout>
	);
}
