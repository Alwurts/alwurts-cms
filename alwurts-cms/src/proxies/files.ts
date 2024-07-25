import { db } from "@/database";
import { files } from "@/database/schema";
import { uploadImage } from "@/lib/s3";
import type { TCreateFile } from "@/types/database/file";
import { eq } from "drizzle-orm";
import "server-only";

export const handleImageUpdate = async (
	image: File | undefined,
	description: string | undefined,
	currentImageId: string | null | undefined,
): Promise<string | null | undefined> => {
	if (image && description) {
		const { id } = await createImageFile(image, description);
		return id;
	}
	if (!image && description && currentImageId) {
		await updateImageDescription(currentImageId, description);
	}
	return currentImageId;
};

export const createImageFile = async (imageFile: File, description: string) => {
	const { imageUrl, imageName, imageSize, mimeType } =
		await uploadImage(imageFile);

	if (!imageUrl) {
		throw new Error("Failed to upload image");
	}

	const result = await db
		.insert(files)
		.values({
			name: imageName,
			type: mimeType,
			description: description,
			url: imageUrl,
			date: new Date().toISOString(),
			size: imageSize,
			createdAt: new Date(),
		})
		.returning();
	return result[0];
};

export const updateImageDescription = async (
	id: string,
	description: string,
) => {
	await db.update(files).set({ description }).where(eq(files.id, id));
};
