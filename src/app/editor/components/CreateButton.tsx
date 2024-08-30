"use client";

import { Button } from "@/components/ui/button";
import { createPost } from "@/server-actions/post";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function CreateButton() {
	const [open, setOpen] = useState(false);
	const [postType, setPostType] = useState<"project" | "blog">("project");

	const handleCreatePost = async () => {
		await createPost(postType);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<PlusIcon className="mr-2 h-4 w-4" />
					Add post
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create new post</DialogTitle>
				</DialogHeader>
				<RadioGroup
					value={postType}
					onValueChange={(value: "project" | "blog") => setPostType(value)}
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="project" id="project" />
						<Label htmlFor="project">Project</Label>
					</div>
					<div className="flex items-center space-x-2">
						<RadioGroupItem value="blog" id="blog" />
						<Label htmlFor="blog">Blog</Label>
					</div>
				</RadioGroup>
				<Button onClick={handleCreatePost}>Create</Button>
			</DialogContent>
		</Dialog>
	);
}
