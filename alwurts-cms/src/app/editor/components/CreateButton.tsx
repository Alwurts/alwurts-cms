import { Button, buttonVariants } from "@/components/ui/button";
import { createPost } from "@/server-actions/post";
import { PlusIcon } from "lucide-react";

export default function CreateButton() {
	return (
		<form className="w-full" action={createPost}>
			<Button type="submit">
				<PlusIcon className="mr-2 h-4 w-4" />
				Add post
			</Button>
		</form>
	);
}
