"use server";

import { withAuthCheck } from "@/lib/auth";
import * as filesProxy from "@/proxies/files";
import { z } from "zod";

export const uploadImage = withAuthCheck(
	async (session, formData: FormData) => {
		const imageFormData = Object.fromEntries(formData);
		console.log("imageFormData", imageFormData);
		const zFile = z.object({
			image: z.instanceof(File),
			description: z.string().optional(),
		});
		const file = zFile.parse(imageFormData);
		const image = await filesProxy.createImageFile(file.image, file.description);
		return image.url;
	},
);
