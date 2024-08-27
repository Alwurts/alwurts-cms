import { Upload } from "@aws-sdk/lib-storage";
import { S3 } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sizeOf from "image-size";

const s3 = new S3({
	endpoint: process.env.S3_ENDPOINT,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
	},
	region: process.env.S3_REGION,
});

export async function uploadImage(file: File): Promise<{
	imageName: string;
	imageUrl: string;
	imageSize: number;
	width: number;
	height: number;
	mimeType: string;
}> {
	const fileBuffer = await file.arrayBuffer();

	// Get image dimensions
	const dimensions = sizeOf(Buffer.from(fileBuffer));
	const width = dimensions.width || 0;
	const height = dimensions.height || 0;

	// Include dimensions in the filename
	const fileName = `${uuidv4()}-${file.name.split(".")[0]}-${width}x${height}.${file.name.split(".")[1]}`;

	const params = {
		Bucket: process.env.S3_BUCKET_NAME as string,
		Key: fileName,
		Body: Buffer.from(fileBuffer),
		ContentType: file.type,
	};

	try {
		const result = await new Upload({
			client: s3,
			params,
		}).done();

		if (!result.Location) {
			throw new Error("No url returned from S3");
		}

		return {
			imageName: fileName,
			imageUrl: result.Location,
			imageSize: file.size,
			width,
			height,
			mimeType: file.type,
		};
	} catch (error) {
		console.error("Error uploading file:", error);
		if (error instanceof Error) {
			throw new Error(`Failed to upload file: ${error.message}`);
		}
		throw new Error("Failed to upload file: Unknown error");
	}
}
