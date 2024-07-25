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
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { TagsFetch } from "@/components/TagsFetch";
import { createPostVersion } from "@/server-actions/postVersions";
import type { TPostVersion } from "@/types/database/postVersion";
import Image from "next/image";
import { PostVersionSchema } from "@/zod/postVersion";
import { convertToFormData } from "@/lib/form";

function extractDimensionsFromFilename(filename: string): {
	width: number;
	height: number;
} {
	const match = filename.match(/(\d+)x(\d+)(?=\.[^.]+$)/);
	if (match) {
		const dimensions = {
			width: Number.parseInt(match[1], 10),
			height: Number.parseInt(match[2], 10),
		};
		console.log("dimensions", dimensions);
		return dimensions;
	}
	return { width: 200, height: 200 }; // Default dimensions if not found
}

const getImageDimensions = (image: string | File) => {
	if (typeof image === "string") {
		return extractDimensionsFromFilename(image);
	}
	if (image instanceof File) {
		return extractDimensionsFromFilename(image.name);
	}
	return { width: 200, height: 200 };
};

export default function Editor({ post }: { post: TPostVersion }) {
	const editorRef = useRef<MDXEditorMethods>(null);
	const formRef = useRef<HTMLFormElement>(null);

	const savePostVersion = useMutation({
		mutationFn: createPostVersion,
		onSuccess: () => {
			toast({
				title: "Post saved",
				description: "Post saved successfully",
			});
		},
	});

	const form = useForm<z.infer<typeof PostVersionSchema>>({
		resolver: zodResolver(PostVersionSchema),
		defaultValues: {
			postId: post.postId,
			title: post.title,
			description: post.description,
			content: post.content,
			author: post.author,
			date: post.date,
			tags: post.tags.reduce(
				(acc, tag, index, array) =>
					`${acc}${tag.tagName}${index < array.length - 1 ? "," : ""}`,
				"",
			),
			/* imageLarge: post.imageLarge ?? "",
			imageSmall: post.imageSmall ?? "", */
		},
	});

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof PostVersionSchema>) {
		const content = editorRef.current?.getMarkdown();
		if (!content) {
			toast({
				title: "No content to save",
				description: "Please write something in the editor before saving",
			});
			return;
		}
		const formData = new FormData();
		formData.append("postId", values.postId);
		formData.append("title", values.title);
		formData.append("description", values.description);
		formData.append("content", content);
		formData.append("author", values.author);
		formData.append(
			"date",
			values.date instanceof Date ? values.date.toISOString() : values.date,
		);
		formData.append("tags", values.tags);
		if (values.imageLarge) {
			formData.append("imageLarge", values.imageLarge);
		}
		if (values.imageSmall) {
			formData.append("imageSmall", values.imageSmall);
		}
		console.log("formData", formData.entries());
		savePostVersion.mutate(formData);
	}

	const imageLargeWatch = useWatch({
		control: form.control,
		name: "imageLarge",
	});

	return (
		<CardLayout
			cardHeaderContent={
				<Form {...form}>
					<form
						ref={formRef}
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid grid-cols-2 gap-y-2 gap-x-4"
					>
						<div className="col-span-2">
							<Button size="sm" type="submit">
								Save
							</Button>
						</div>
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
						{/* <FormField
							control={form.control}
							name="imageLarge"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Image Large</FormLabel>
									{imageLargeWatch ? (
										<Image
											src={URL.createObjectURL(imageLargeWatch)}
											alt="Post image preview"
											width={200}
											height={200}
											className="object-cover"
										/>
									) : post.imageLarge ? (
										<Image
											src={post.imageLarge.url}
											alt="Post image"
											width={getImageDimensions(post.imageLarge.name).width}
											height={getImageDimensions(post.imageLarge.name).height}
											className="object-none"
										/>
									) : null}
									<FormControl>
										<Input
											placeholder="Post Image"
											type="file"
											accept="image/png, image/jpeg"
											onChange={(e) => {
												console.log(e.target.files);
												const file = e.target.files?.[0];
												field.onChange(file);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/> */}
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Post Date</FormLabel>
									<FormControl>
										<Input
											placeholder="Post Date"
											type="date"
											value={
												field.value instanceof Date
													? field.value.toISOString().split("T")[0]
													: field.value
											}
											onChange={(e) => {
												const date = new Date(e.target.value);
												field.onChange(date);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormItem>
							<FormLabel>Created at</FormLabel>
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
											fieldValue={
												field.value.length > 0 ? field.value.split(",") : []
											}
											setFieldValue={(tags) => field.onChange(tags.join(","))}
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
