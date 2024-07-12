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
			onChange={(e) => console.log(e)}
			ref={editorRef}
			markdown={markdown}
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
