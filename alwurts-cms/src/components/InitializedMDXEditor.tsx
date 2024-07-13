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
				/* codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
				linkPlugin(),
				linkDialogPlugin(), */
				quotePlugin(),
				listsPlugin(),
				thematicBreakPlugin(),
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
						<>
							<UndoRedo />
							<Separator />
							<BoldItalicUnderlineToggles />
							<Separator />
							{/* <CodeToggle />
							<InsertThematicBreak /> */}
							<BlockTypeSelect />
							<Separator />
							<ListsToggle />
							{/* <CreateLink />
							<Separator />
							<DiffSourceToggleWrapper>
								<UndoRedo />
							</DiffSourceToggleWrapper>
							<InsertCodeBlock />
							<InsertImage /> */}
						</>
					),
				}),
			]}
			{...props}
			ref={editorRef}
			className={cn("border-2 rounded-xl", props.className)}
			contentEditableClassName="prose"
		/>
	);
}
