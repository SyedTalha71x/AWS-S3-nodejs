import { sendFileToAWS } from "./src/functions.ts";
import { subFolderS3 } from "./src/awss3connect.ts";

async function uploadFileToAWS (dataObject: any){
    try {
        const savePath = `uploads/image.png`;
        const fullKey = `${subFolderS3.sub1}/${dataObject.fileName}`
        console.log(fullKey, '----------');
        
        await sendFileToAWS(`${fullKey}`,`${savePath}`);
    } catch (error) {
        console.error("Error uploading file to AWS S3:", error);
        throw error;
    }
}

const dataObject ={
    fileName: 'image.png'
}

uploadFileToAWS(dataObject);