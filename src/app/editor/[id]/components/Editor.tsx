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
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { TagsFetch } from "@/components/TagsFetch";
import Image from "next/image";
import { LinksFetch } from "@/components/LinksFetch";
import LoadingButton from "@/components/ui/loading-button";
import type { TPost } from "@/types/database/post";
import { updatePost } from "@/server-actions/post";
import { PostEditorFormSchema } from "@/zod/post";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function Editor({
	post,
}: {
	post: TPost;
}) {
	const editorRef = useRef<MDXEditorMethods>(null);
	const formRef = useRef<HTMLFormElement>(null);

	const { latestVersion } = post;

	const savePostVersion = useMutation({
		mutationFn: updatePost,
		onSuccess: () => {
			toast({
				title: "Post saved",
				description: "Post saved successfully",
			});
		},
	});

	const form = useForm<z.infer<typeof PostEditorFormSchema>>({
		resolver: zodResolver(PostEditorFormSchema),
		defaultValues: {
			postId: latestVersion?.postId,
			url: latestVersion?.url,
			title: latestVersion?.title,
			description: latestVersion?.description,
			content: latestVersion?.content,
			author: latestVersion?.author,
			date: latestVersion?.date
				? latestVersion.date.toISOString().split("T")[0]
				: "",
			tags: latestVersion?.tags
				? JSON.stringify(latestVersion.tags.map((tag) => tag.tagName))
				: "",
			links: latestVersion?.links
				? JSON.stringify(latestVersion.links)
				: undefined,
			imageLarge: undefined,
			imageLargeDescription: latestVersion?.imageLarge?.description || "",
			imageSmall: undefined,
			imageSmallDescription: latestVersion?.imageSmall?.description || "",
			type: post.type,
		},
	});

	if (!latestVersion) {
		return <div>No post latest version found</div>;
	}

	// Modify the onSubmit function to accept a publish parameter
	function onSubmit(values: z.infer<typeof PostEditorFormSchema>) {
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
		formData.append("date", values.date);

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
		if (values.tags) {
			formData.append("tags", values.tags);
		}
		if (values.links) {
			formData.append("links", values.links);
		}
		formData.append("type", values.type);

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
							onClick={form.handleSubmit(onSubmit)}
						>
							Save
						</LoadingButton>
						{/* <LoadingButton
							isLoading={savePostVersion.isPending}
							disabled={savePostVersion.isPending}
							variant="outline"
							onClick={form.handleSubmit((data) => onSubmit(data, true))}
						>
							Save and Publish
						</LoadingButton> */}
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
							name="type"
							render={({ field }) => (
								<FormItem className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
									<FormLabel className="min-w-[100px]">Post Type</FormLabel>
									<FormControl>
										<Select
											onValueChange={(value) => {
												field.onChange(value);
												toast({
													title: "Post Type Changed",
													description:
														"The post type has been changed. This may affect how the post is displayed and managed. The change will be saved when you click the Save button.",
													duration: 10000,
												});
											}}
											value={field.value}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Select post type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="project">Project</SelectItem>
												<SelectItem value="blog">Blog</SelectItem>
											</SelectContent>
										</Select>
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
											value={field.value}
											onChange={(e) => {
												const date = new Date(e.target.value);
												field.onChange(e.target.value);
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
											fieldValue={field.value}
											setFieldValue={field.onChange}
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
											fieldValue={field.value}
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
											: latestVersion?.imageLarge?.url ?? ""
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
											: latestVersion?.imageSmall?.url ?? ""
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
						<SafeMDXEditor
							ref={editorRef}
							markdown={latestVersion?.content ?? "Loading..."}
						/>
					</div>
				</form>
			</Form>
		</div>
	);
}
