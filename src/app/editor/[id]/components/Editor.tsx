"use client";

import { SafeMDXEditor } from "@/components/SafeMDXEditor";
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
import { useRef, useState } from "react";
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
import { LinksFetch } from "@/components/LinksFetch";
import type { Link } from "@/zod/postLinks";
import LoadingButton from "@/components/ui/loading-button";

export default function Editor({ post }: { post: TPostVersion }) {
	const editorRef = useRef<MDXEditorMethods>(null);
	const [editorIsDirty, setEditorIsDirty] = useState(false);
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
			url: post.url,
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
			imageLarge: undefined,
			imageLargeDescription: post.imageLarge?.description || "",
			imageSmall: undefined,
			imageSmallDescription: post.imageSmall?.description || "",
			links:
				typeof post.links === "string" ? JSON.parse(post.links) : post.links,
		},
	});

	// Modify the onSubmit function to accept a publish parameter
	function onSubmit(
		values: z.infer<typeof PostVersionSchema>,
		publish: boolean,
	) {
		const content = editorRef.current?.getMarkdown();
		if (!content) {
			toast({
				title: "No content to save",
				description: "Please write something in the editor before saving",
			});
			return;
		}

		if (values.imageLarge && !values.imageLargeDescription?.length) {
			form.setError("imageLargeDescription", {
				type: "manual",
				message: "Please provide a description for the large image",
			});
			return;
		}

		if (values.imageSmall && !values.imageSmallDescription?.length) {
			form.setError("imageSmallDescription", {
				type: "manual",
				message: "Please provide a description for the small image",
			});
			return;
		}

		const formData = new FormData();
		formData.append("postId", values.postId);
		formData.append("url", values.url);
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
		if (values.imageLargeDescription) {
			formData.append("imageLargeDescription", values.imageLargeDescription);
		}

		if (values.imageSmall) {
			formData.append("imageSmall", values.imageSmall);
		}
		if (values.imageSmallDescription) {
			formData.append("imageSmallDescription", values.imageSmallDescription);
		}

		formData.append("links", JSON.stringify(values.links));

		if (publish) {
			formData.append("publish", publish.toString());
		}

		savePostVersion.mutate(formData);
	}

	const imageLargeWatch = useWatch({
		control: form.control,
		name: "imageLarge",
	});

	const imageSmallWatch = useWatch({
		control: form.control,
		name: "imageSmall",
	});

	return (
		<div className="max-w-4xl mx-auto py-6 sm:py-8">
			<Form {...form}>
				<form ref={formRef} className="flex flex-col gap-4">
					{/* Title */}
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="px-4">
								<FormControl>
									<Input
										placeholder="Untitled"
										{...field}
										className="text-4xl font-bold border-none px-0 focus-visible:ring-0"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Action Buttons - Moved here */}
					<div className="flex gap-4 px-4">
						<LoadingButton
							isLoading={savePostVersion.isPending}
							disabled={savePostVersion.isPending}
							onClick={form.handleSubmit((data) => onSubmit(data, false))}
						>
							Save
						</LoadingButton>
						<LoadingButton
							isLoading={savePostVersion.isPending}
							disabled={savePostVersion.isPending}
							variant="outline"
							onClick={form.handleSubmit((data) => onSubmit(data, true))}
						>
							Save and Publish
						</LoadingButton>
					</div>

					{/* Attributes section */}
					<div className="py-4 px-4 rounded-lg space-y-2">
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<FormLabel className="min-w-[100px]">URL</FormLabel>
									<FormControl className="flex-1">
										<Input placeholder="Post URL" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<FormLabel className="min-w-[100px]">Description</FormLabel>
									<FormControl className="flex-1">
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
								<FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<FormLabel className="min-w-[100px]">Author</FormLabel>
									<FormControl className="flex-1">
										<Input placeholder="Post Author" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<FormLabel className="min-w-[100px]">Post Date</FormLabel>
									<FormControl className="flex-1">
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
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<FormLabel className="min-w-[100px]">Tags</FormLabel>
									<FormControl className="flex-1">
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
						<FormField
							control={form.control}
							name="links"
							render={({ field }) => (
								<FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<FormLabel className="min-w-[100px]">Links</FormLabel>
									<FormControl className="flex-1">
										<LinksFetch
											fieldValue={field.value as Link[] | null}
											setFieldValue={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Images section */}
					<div className="flex flex-col sm:flex-row gap-5 px-4">
						{/* Large Image */}
						<div className="flex-1 border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold mb-2">Large Image</h3>
							<div className="flex flex-col gap-4">
								<Image
									src={
										imageLargeWatch
											? URL.createObjectURL(imageLargeWatch)
											: post.imageLarge?.url ?? ""
									}
									alt="Post large image"
									width={200}
									height={200}
									className="object-contain h-[200px] w-auto"
								/>
								<FormField
									control={form.control}
									name="imageLarge"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="file"
													accept="image/png, image/jpeg"
													onChange={(e) => {
														const file = e.target.files?.[0];
														field.onChange(file);
														form.setValue("imageLargeDescription", "");
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="imageLargeDescription"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder="Describe the large image"
													{...field}
													onChange={(e) => {
														field.onChange(e);
														form.clearErrors("imageLargeDescription");
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						{/* Small Image */}
						<div className="flex-1 border border-gray-200 rounded-lg p-4">
							<h3 className="text-lg font-semibold mb-2">Small Image</h3>
							<div className="flex flex-col gap-4">
								<Image
									src={
										imageSmallWatch
											? URL.createObjectURL(imageSmallWatch)
											: post.imageSmall?.url ?? ""
									}
									alt="Post small image"
									width={200}
									height={200}
									className="object-contain h-[200px] w-auto"
								/>
								<FormField
									control={form.control}
									name="imageSmall"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="file"
													accept="image/png, image/jpeg"
													onChange={(e) => {
														const file = e.target.files?.[0];
														field.onChange(file);
														form.setValue("imageSmallDescription", "");
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="imageSmallDescription"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													placeholder="Describe the small image"
													{...field}
													onChange={(e) => {
														field.onChange(e);
														form.clearErrors("imageSmallDescription");
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>

					{/* Content Editor */}
					<div className="px-4">
						<SafeMDXEditor ref={editorRef} markdown={post.content} />
					</div>
				</form>
			</Form>
		</div>
	);
}
