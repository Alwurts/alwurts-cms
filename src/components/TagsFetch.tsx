"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { createPostTag, getPostTagsFilter } from "@/server-actions/postTags";
import { FormItem, FormLabel, FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Toggle } from "./ui/toggle";

const createTagSchema = z.object({
	name: z.string().min(2).max(50),
});

export function TagsFetch({
	fieldValue,
	setFieldValue,
}: {
	fieldValue: string[];
	setFieldValue: (value: string[]) => void;
}) {
	const [isOpen, setOpen] = useState(false);
	const [stringFilter, setStringFilter] = useState("");
	const [debouncedStringFilter] = useDebounce(stringFilter, 300);

	const queryClient = useQueryClient();

	const {
		data: tags,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["postTags", debouncedStringFilter],
		queryFn: () => getPostTagsFilter(debouncedStringFilter),
	});

	const createTag = useMutation({
		mutationFn: createPostTag,
		onSuccess: () => {
			refetch();
			toast({
				title: "Tag created",
				description: "Tag created successfully",
			});
		},
	});

	const form = useForm<z.infer<typeof createTagSchema>>({
		resolver: zodResolver(createTagSchema),
		defaultValues: {
			name: "",
		},
	});

	function onSubmit(values: z.infer<typeof createTagSchema>) {
		createTag.mutate(values);
	}

	return (
		<div className="flex flex-wrap gap-2">
			<Popover open={isOpen} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" type="button">
						Add Tag
					</Button>
				</PopoverTrigger>
				{fieldValue.map((tag) => (
					<Button
						key={tag}
						variant="secondary"
						size="sm"
						type="button"
						className="capitalize"
						onClick={() => setOpen(true)}
					>
						{tag}
						<X className="ml-2 h-3 w-3" />
					</Button>
				))}
				<PopoverContent align="start" className="w-80 z-40 space-y-4">
					<div className="space-y-2">
						<h4>Create new tag</h4>
						<form
							className="space-y-4"
							onSubmit={(event) => {
								form.handleSubmit(onSubmit)(event);
								event.stopPropagation();
							}}
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<Input placeholder="Create new tag" {...field} />
									</FormItem>
								)}
							/>
							<Button size="sm" type="submit" disabled={createTag.isPending}>
								{createTag.isPending ? "Creating..." : "Create"}
							</Button>
						</form>
					</div>
					<Separator />
					<div className="space-y-4">
						<Input
							placeholder="Search tags..."
							value={stringFilter}
							onChange={(e) => setStringFilter(e.target.value)}
						/>
						<div className="max-h-[200px] overflow-y-auto">
							{isFetching ? (
								<Skeleton className="h-16 w-full" />
							) : tags?.length ? (
								tags.map((tag) => (
									<Toggle
										key={tag.name}
										pressed={fieldValue.includes(tag.name)}
										onPressedChange={(pressed) => {
											if (pressed) {
												setFieldValue([...fieldValue, tag.name]);
											} else {
												setFieldValue(fieldValue.filter((t) => t !== tag.name));
											}
										}}
										size="sm"
										variant="outline"
										className="mr-2 mb-2 capitalize"
									>
										{tag.name}
									</Toggle>
								))
							) : (
								<p className="text-center">No tags found</p>
							)}
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
