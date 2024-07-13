"use client";

import { SafeMDXEditor } from "@/components/SafeMDXEditor";
import { CardLayout } from "@/components/layout/CardLayout";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormMessage,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { TagsFetch } from "@/components/TagsFetch";
import { createPostVersion } from "@/server-actions/postVersions";
import type {
	TPostVersion,
	TUpdatePostVersion,
} from "@/types/database/postVersion";

const formSchema = z.object({
	title: z.string().min(2).max(50),
	description: z.string().min(2).max(50),
	author: z.string().min(2).max(50),
	tags: z.array(z.string()),
});

export default function Editor({ post }: { post: TPostVersion }) {
	const editorRef = useRef<MDXEditorMethods>(null);
	const formRef = useRef<HTMLFormElement>(null);

	const savePostVersion = useMutation({
		mutationFn: async (post: TUpdatePostVersion) => {
			createPostVersion(post);
		},
		onSuccess: () => {
			toast({
				title: "Post saved",
				description: "Post saved successfully",
			});
		},
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: post.title,
			description: post.description,
			author: post.author,
			tags: post.tags.map((tag) => tag.tagName || ""),
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		const content = editorRef.current?.getMarkdown();
		if (!content) {
			toast({
				title: "No content to save",
				description: "Please write something in the editor before saving",
			});
			return;
		}
		console.log("content", content);
		savePostVersion.mutate({
			...values,
			content,
			postId: post.postId,
			tags: values.tags.map((tag) => ({ name: tag })),
		});
	}

	return (
		<CardLayout
			cardHeaderContent={
				<Form {...form}>
					<form
						ref={formRef}
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid grid-cols-2 gap-y-2 gap-x-4"
					>
						<Button size="sm" type="submit" className="col-span-2">
							Save
						</Button>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input placeholder="Post Title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="Post Description" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="author"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Author</FormLabel>
									<FormControl>
										<Input placeholder="Post Author" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormItem>
							<FormLabel>Last Saved</FormLabel>
							<Input value={post.createdAt.toLocaleString()} disabled />
						</FormItem>
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem className="col-span-2">
									<FormLabel>Tags</FormLabel>
									<FormControl>
										<TagsFetch
											fieldValue={field.value}
											setFieldValue={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			}
			classname="max-w-6xl mx-auto"
		>
			<SafeMDXEditor ref={editorRef} markdown={post.content} />
		</CardLayout>
	);
}
