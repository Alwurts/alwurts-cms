"use client";

import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import { Loader2Icon } from "lucide-react";
import dynamic from "next/dynamic";
import { Suspense, forwardRef } from "react";
import { Skeleton } from "./ui/skeleton";

// This is the only place InitializedMDXEditor is imported directly.
const Editor = dynamic(() => import("./InitializedMDXEditor"), {
	// Make sure we turn SSR off
	ssr: false,
	loading: () => <Skeleton className="w-full h-[500px]" />,
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
export const SafeMDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
	(props, ref) => <Editor {...props} editorRef={ref} />,
);

// TS complains without the following line
SafeMDXEditor.displayName = "ForwardRefEditor";
