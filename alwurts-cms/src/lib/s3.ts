import AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
	endpoint: process.env.B2_ENDPOINT,
	accessKeyId: process.env.B2_ACCESS_KEY_ID,
	secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
	signatureVersion: "v4",
});

export default s3;

export async function uploadImage(file: File) {
  const fileBuffer = await file.arrayBuffer();
  const fileName = `${uuidv4()}-${file.name}`;

	if (!process.env.S3_BUCKET_NAME) {
		throw new Error('S3_BUCKET_NAME is not set');
	}

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(fileBuffer),
    ContentType: file.type,
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}
