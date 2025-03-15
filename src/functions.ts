import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { configDotenv } from "dotenv";
import fs from "fs";

configDotenv();

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

console.log("Bucket Name:", process.env.BUCKET_NAME);
console.log("AWS Region:", process.env.REGION);
console.log("Access Key:", process.env.ACCESS_KEY);

const sendFileToAWS = async (fileName: string, filePath: string) => {
  try {

    console.log('file name -----', fileName);
    console.log('file path -----', filePath);
    
    
    const uploadParams: any = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: fs.createReadStream(filePath),
    };
    // console.log(uploadParams);
    
    await s3Client.send(new PutObjectCommand(uploadParams)).then((data) => {
      console.log(data);
    });
  } catch (error: any) {
    console.log("failed to send file to aws -----------", error);
  }
};

const getFileFromAWS = async (fileName: any, expireTime = null) => {
  try {
    const isFileExists = await exports.isFileAvailableInAWS(fileName);

    if (isFileExists) {
      const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
      });

      if (expireTime !== null) {
        const url = await getSignedUrl(s3Client, command, {
          expiresIn: expireTime,
        });
        return url;
      } else {
        const url = await getSignedUrl(s3Client, command);
        return url;
      }
    } else {
      console.log("File not exists in AWS");
    }
  } catch (error: any) {
    console.log(error);
  }
};

const isFileAvailableInAWS = async (fileName: any) => {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
      })
    );

    return true;
  } catch (error: any) {
    if (error.name === "NotFound") {
      return false;
    } else {
      return false;
    }
  }
};

const DeleteFileFromAWS = async (fileName: any) => {
  try {
    const uploadParams: any = {
      Bucket: process.env.BUCKET_NAME,
      file: fileName,
    };
    await s3Client.send(new DeleteObjectCommand(uploadParams)).then((data) => {
      console.log(data);
    });
  } catch (error: any) {
    console.log(error);
  }
};


export {
    sendFileToAWS,
    getFileFromAWS,
    isFileAvailableInAWS,
    DeleteFileFromAWS
}