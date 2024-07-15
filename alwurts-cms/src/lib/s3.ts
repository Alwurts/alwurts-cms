import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import sizeOf from "image-size";

const s3 = new AWS.S3({
	endpoint: process.env.S3_ENDPOINT,
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	signatureVersion: "v4",
});

export async function uploadImage(file: File) {
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
		const result = await s3.upload(params).promise();
		return result.Location;
	} catch (error) {
		console.error("Error uploading file:", error);
		if (error instanceof Error) {
			throw new Error(`Failed to upload file: ${error.message}`);
		}
		throw new Error("Failed to upload file: Unknown error");
	}
}
