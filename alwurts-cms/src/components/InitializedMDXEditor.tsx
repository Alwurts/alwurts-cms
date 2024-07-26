"use client";

import { cn } from "@/lib/utils";
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
	type MDXEditorMethods,
	type MDXEditorProps,
	type SandpackConfig,
	sandpackPlugin,
	codeMirrorPlugin,
	InsertSandpack,
	ShowSandpackInfo,
	ChangeCodeMirrorLanguage,
	ConditionalContents,
	diffSourcePlugin,
} from "@mdxeditor/editor";
import type { ForwardedRef } from "react";

export default function InitializedMDXEditor({
	editorRef,
	...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
	return (
		<MDXEditor
			plugins={[
				headingsPlugin(),
				codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
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
				/* imagePlugin({
					imageUploadHandler: () => {
						return Promise.resolve("https://picsum.photos/200/300");
					},
					imageAutocompleteSuggestions: [
						"https://picsum.photos/200/300",
						"https://picsum.photos/200",
					],
				}), */
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
											<DiffSourceToggleWrapper options={
												['rich-text', 'source']
											}>
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
												<InsertCodeBlock />
												<Separator />
												{/* <InsertImage /> */}
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
