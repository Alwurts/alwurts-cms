"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { FormItem, FormLabel, FormField } from "@/components/ui/form";
import { X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { linkSchema, type Link } from "@/zod/postLinks";

export function LinksFetch({
	fieldValue,
	setFieldValue,
}: {
	fieldValue: Link[] | null;
	setFieldValue: (value: Link[]) => void;
}) {
	const [isOpen, setOpen] = useState(false);

	const form = useForm<Link>({
		resolver: zodResolver(linkSchema),
		defaultValues: {
			title: "",
			url: "",
		},
	});

	function onSubmit(values: Link) {
		if (!fieldValue) {
			setFieldValue([values]);
		} else {
			setFieldValue([...fieldValue, values]);
		}
		form.reset();
	}

	function removeLink(index: number) {
		if (!fieldValue) return;
		setFieldValue(fieldValue.filter((_, i) => i !== index));
	}

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap gap-2">
				{fieldValue?.map((link, index) => (
					<div key={link.url} className="flex items-center space-x-2">
						<Button
							variant="secondary"
							size="sm"
							type="button"
							onClick={() => removeLink(index)}
						>
							<span className="mr-2">{link.title}</span>
							<span className="text-xs text-gray-500">{link.url}</span>
							<X className="ml-2 h-3 w-3" />
						</Button>
					</div>
				))}
			</div>
			<Popover open={isOpen} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" type="button">
						Add Link
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="w-80 z-40 space-y-4">
					<form
						onSubmit={(event) => {
							form.handleSubmit(onSubmit)(event);
							event.stopPropagation();
						}}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<Input placeholder="Link title" {...field} />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL</FormLabel>
									<Input
										type="url"
										placeholder="https://example.com"
										{...field}
									/>
								</FormItem>
							)}
						/>
						<Button size="sm" type="submit">
							Add Link
						</Button>
					</form>
				</PopoverContent>
			</Popover>
		</div>
	);
}
