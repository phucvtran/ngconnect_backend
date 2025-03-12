// config/aws.ts
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-2",
});

export const s3 = new AWS.S3();
export const BUCKET_NAME = "ng-connect"; //s3 bucket name
