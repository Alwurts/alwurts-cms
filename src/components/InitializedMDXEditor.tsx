"use client";

import { cn } from "@/lib/utils";
import { uploadImage } from "@/server-actions/file";
import {
	MDXEditor,
	headingsPlugin,
	toolbarPlugin,
	UndoRedo,
	BoldItalicUnderlineToggles,
	quotePlugin,
	listsPlugin,
	thematicBreakPlugin,
	linkPlugin,
	imagePlugin,
	codeBlockPlugin,
	BlockTypeSelect,
	CodeToggle,
	CreateLink,
	DiffSourceToggleWrapper,
	InsertCodeBlock,
	InsertImage,
	InsertThematicBreak,
	ListsToggle,
	Separator,
	linkDialogPlugin,
	codeMirrorPlugin,
	ChangeCodeMirrorLanguage,
	ConditionalContents,
	diffSourcePlugin,
	tablePlugin,
	InsertTable,
	type MDXEditorMethods,
	type MDXEditorProps,
} from "@mdxeditor/editor";
import { useMutation } from "@tanstack/react-query";
import type { ForwardedRef } from "react";

export default function InitializedMDXEditor({
	editorRef,
	...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
	const uploadImageMutation = useMutation({
		mutationFn: uploadImage,
	});

	return (
		<MDXEditor
			plugins={[
				headingsPlugin(),
				codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
				tablePlugin(),
				codeMirrorPlugin({
					codeBlockLanguages: {
						js: "JavaScript",
						css: "CSS",
						ts: "TypeScript",
						py: "Python",
						html: "HTML",
						md: "Markdown",
						json: "JSON",
						yaml: "YAML",
					},
				}),
				linkPlugin(),
				linkDialogPlugin(),
				quotePlugin(),
				listsPlugin(),
				thematicBreakPlugin(),
				diffSourcePlugin({
					diffMarkdown: "An older version",
					viewMode: "rich-text",
				}),
				imagePlugin({
					imageUploadHandler: async (image) => {
						const formData = new FormData();
						formData.append("image", image);
						const imageUrl = await uploadImageMutation.mutateAsync(formData);
						if (!imageUrl) {
							throw new Error("Failed to upload image");
						}
						return imageUrl;
					},
				}),
				toolbarPlugin({
					toolbarContents: () => (
						<ConditionalContents
							options={[
								{
									when: (editor) => editor?.editorType === "codeblock",
									contents: () => <ChangeCodeMirrorLanguage />,
								},
								{
									fallback: () => (
										<>
											<DiffSourceToggleWrapper
												options={["rich-text", "source"]}
											>
												<UndoRedo />
												<Separator />
												<BoldItalicUnderlineToggles />
												<Separator />
												<CodeToggle />
												<InsertThematicBreak />
												<BlockTypeSelect />
												<Separator />
												<ListsToggle />
												<CreateLink />
												<InsertTable />
												<InsertCodeBlock />
												<Separator />
												<InsertImage />
											</DiffSourceToggleWrapper>
										</>
									),
								},
							]}
						/>
					),
				}),
			]}
			{...props}
			ref={editorRef}
			className={cn("border-2 rounded-xl", props.className)}
			contentEditableClassName="prose max-w-none lg:prose-lg dark:prose-invert prose-headings:mb-5"
		/>
	);
}
