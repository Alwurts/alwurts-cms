"use client";

import {
	MDXEditor as MDXEditorParent,
	type MDXEditorMethods,
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
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface EditorProps {
	markdown: string;
	editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

export default function MDXEditor({ markdown, editorRef }: EditorProps) {
	return (
		<MDXEditorParent
			ref={editorRef}
			markdown={markdown}
			className="border rounded-md"
			plugins={[
				headingsPlugin(),
				codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
				linkPlugin(),
				linkDialogPlugin(),
				quotePlugin(),
				listsPlugin(),
				thematicBreakPlugin(),
				imagePlugin({
					imageUploadHandler: () => {
						return Promise.resolve("https://picsum.photos/200/300");
					},
					imageAutocompleteSuggestions: [
						"https://picsum.photos/200/300",
						"https://picsum.photos/200",
					],
				}),
				toolbarPlugin({
					toolbarContents: () => (
						<>
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
							<Separator />
							<DiffSourceToggleWrapper>
								<UndoRedo />
							</DiffSourceToggleWrapper>
							<InsertCodeBlock />
							<InsertImage />
						</>
					),
				}),
			]}
		/>
	);
}
