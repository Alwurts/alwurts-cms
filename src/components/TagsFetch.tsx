"use client";

import { useState, useRef, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { createPostTag, getPostTagsFilter } from "@/server-actions/postTags";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

export function TagsFetch({
	fieldValue,
	setFieldValue,
}: {
	fieldValue: string[];
	setFieldValue: (value: string[]) => void;
}) {
	const [isOpen, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [debouncedSearchValue] = useDebounce(searchValue, 300);
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		data: tags,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ["postTags", debouncedSearchValue],
		queryFn: () => getPostTagsFilter(debouncedSearchValue),
	});

	const createTag = useMutation({
		mutationFn: createPostTag,
		onSuccess: (newTag) => {
			refetch();
			if (newTag) {
				addTag(newTag.name);
				setSearchValue("");
				toast({
					title: "Tag created",
					description: "Tag created successfully",
				});
			} else {
				toast({
					title: "Error",
					description: "Failed to create tag",
					variant: "destructive",
				});
			}
		},
	});

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	const addTag = (tagName: string) => {
		if (!fieldValue.includes(tagName)) {
			setFieldValue([...fieldValue, tagName]);
		}
	};

	const removeTag = (tagToRemove: string) => {
		setFieldValue(fieldValue.filter((tag) => tag !== tagToRemove));
	};

	const handleCreateTag = () => {
		if (searchValue && !fieldValue.includes(searchValue)) {
			createTag.mutate({ name: searchValue });
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleCreateTag();
		}
	};

	const filteredTags = tags?.filter(tag => !fieldValue.includes(tag.name)) || [];

	return (
		<Popover open={isOpen} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div className="flex flex-wrap gap-2 cursor-pointer min-h-[2.5rem] items-center border rounded-md p-2 hover:bg-gray-50 transition-colors">
					{fieldValue.length > 0 ? (
						fieldValue.map((tag) => (
							<Button
								key={tag}
								variant="secondary"
								size="sm"
								type="button"
								className="capitalize"
							>
								{tag}
							</Button>
						))
					) : (
						<span className="text-gray-400">Click to add tags</span>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-80 z-40 p-4">
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<Input
							ref={inputRef}
							placeholder="Search or add tags..."
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							onKeyDown={handleKeyDown}
							className="flex-grow"
						/>
						<Button size="sm" onClick={handleCreateTag} disabled={!searchValue}>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					{fieldValue.length > 0 && (
						<div className="flex flex-wrap gap-2 pb-2 border-b">
							{fieldValue.map((tag) => (
								<Button
									key={tag}
									variant="secondary"
									size="sm"
									type="button"
									className="capitalize"
									onClick={() => removeTag(tag)}
								>
									{tag}
									<X className="ml-2 h-3 w-3" />
								</Button>
							))}
						</div>
					)}
					<div className="max-h-[200px] overflow-y-auto space-y-2">
						{isFetching ? (
							<Skeleton className="h-16 w-full" />
						) : filteredTags.length ? (
							filteredTags.map((tag) => (
								<Button
									key={tag.name}
									variant="ghost"
									size="sm"
									type="button"
									className="w-full justify-start capitalize"
									onClick={() => addTag(tag.name)}
								>
									{tag.name}
								</Button>
							))
						) : (
							searchValue && (
								<p className="text-center text-sm text-gray-500">
									No matching tags. Press Enter to create.
								</p>
							)
						)}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
