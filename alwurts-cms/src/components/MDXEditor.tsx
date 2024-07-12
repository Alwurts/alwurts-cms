"use client";

import {
	MDXEditor as MDXEditorParent,
	type MDXEditorMethods,
	headingsPlugin,
	toolbarPlugin,
	UndoRedo,
	BoldItalicUnderlineToggles,
} from "@mdxeditor/editor";
import { FC } from "react";
import '@mdxeditor/editor/style.css'

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
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {' '}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
            </>
          )
        })
      ]}
		/>
	);
}
