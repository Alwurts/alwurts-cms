import { db } from "@/database";
import { files } from "@/database/schema";
import { uploadImage } from "@/lib/s3";
import type { TCreateFile } from "@/types/database/file";
import "server-only";

export const createImageFile = async (imageFile: File) => {
	const { imageUrl, imageName, imageSize, mimeType } = await uploadImage(imageFile);

	if (!imageUrl) {
		throw new Error("Failed to upload image");
	}

	const result = await db.insert(files).values({
		name: imageName,
		type: mimeType,
		description: "",
		url: imageUrl,
		date: new Date().toISOString(),
		size: imageSize,
		createdAt: new Date(),
	}).returning();
	return result[0];
};
