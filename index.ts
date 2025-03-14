import { sendFileToAWS } from "./src/functions.ts";
import { subFolderS3 } from "./src/awss3connect.ts";

async function uploadFileToAWS (dataObject: any){
    try {
        const savePath = `uploads/image.png`;
        
        await sendFileToAWS(`${subFolderS3.sub1}/${dataObject.fileName}`,`${savePath}`);
    } catch (error) {
        console.error("Error uploading file to AWS S3:", error);
        throw error;
    }
}

const savePath = `uploads/image.png`;
uploadFileToAWS(savePath);