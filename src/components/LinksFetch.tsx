"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { linkSchema, type Link } from "@/zod/postLinks";
import { toast } from "@/components/ui/use-toast";

export function LinksFetch({
	fieldValue,
	setFieldValue,
}: {
	fieldValue: Link[] | null;
	setFieldValue: (value: Link[]) => void;
}) {
	const [isOpen, setOpen] = useState(false);
	const [newLink, setNewLink] = useState({ title: "", url: "" });
	const [editingLink, setEditingLink] = useState<Link | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isOpen]);

	const addOrUpdateLink = () => {
		const linkToSave = editingLink || newLink;
		const linkResult = linkSchema.safeParse(linkToSave);
		if (linkResult.success) {
			if (editingLink) {
				setFieldValue(
					(fieldValue || []).map((link) =>
						link.url === editingLink.url ? linkResult.data : link
					)
				);
				setEditingLink(null);
				toast({
					title: "Link updated",
					description: "Link updated successfully",
				});
			} else {
				setFieldValue([...(fieldValue || []), linkResult.data]);
				toast({
					title: "Link added",
					description: "Link added successfully",
				});
			}
			setNewLink({ title: "", url: "" });
		} else {
			toast({
				title: "Error",
				description: "Invalid link. Please check the title and URL.",
				variant: "destructive",
			});
		}
	};

	const removeLink = (linkToRemove: Link) => {
		setFieldValue((fieldValue || []).filter((link) => link.url !== linkToRemove.url));
		if (editingLink && editingLink.url === linkToRemove.url) {
			setEditingLink(null);
			setNewLink({ title: "", url: "" });
		}
	};

	const startEditingLink = (link: Link) => {
		setEditingLink(link);
		setNewLink(link);
	};

	const cancelEditing = () => {
		setEditingLink(null);
		setNewLink({ title: "", url: "" });
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addOrUpdateLink();
		}
	};

	return (
		<Popover open={isOpen} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div className="flex flex-wrap gap-2 cursor-pointer min-h-[2.5rem] items-center border rounded-md p-2 hover:bg-gray-50 transition-colors">
					{fieldValue && fieldValue.length > 0 ? (
						fieldValue.map((link) => (
							<Button
								key={link.url}
								variant="secondary"
								size="sm"
								type="button"
							>
								{link.title}
							</Button>
						))
					) : (
						<span className="text-gray-400">Click to add links</span>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-80 z-40 p-4">
				<div className="space-y-4">
					<div className="flex flex-col space-y-2">
						<Input
							ref={inputRef}
							placeholder="Link title"
							value={newLink.title}
							onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
							onKeyDown={handleKeyDown}
						/>
						<Input
							placeholder="https://example.com"
							value={newLink.url}
							onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
							onKeyDown={handleKeyDown}
						/>
						<Button 
							size="sm" 
							onClick={addOrUpdateLink} 
							disabled={!newLink.title || !newLink.url}
						>
							<Plus className="h-4 w-4 mr-2" /> 
							{editingLink ? 'Update Link' : 'Add Link'}
						</Button>
						{editingLink && (
							<Button size="sm" variant="outline" onClick={cancelEditing}>
								Cancel Editing
							</Button>
						)}
					</div>
					{fieldValue && fieldValue.length > 0 && (
						<div className="flex flex-wrap gap-2 pb-2 border-b">
							{fieldValue.map((link) => (
								<div key={link.url} className="flex items-center">
									<Button
										variant="secondary"
										size="sm"
										type="button"
										className="pr-1"
										onClick={() => startEditingLink(link)}
									>
										{link.title}
										<Button
											variant="ghost"
											size="sm"
											className="h-4 w-4 p-0 ml-1"
											onClick={(e) => {
												e.stopPropagation();
												removeLink(link);
											}}
										>
											<X className="h-3 w-3" />
										</Button>
									</Button>
								</div>
							))}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
