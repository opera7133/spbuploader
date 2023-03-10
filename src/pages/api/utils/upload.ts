import { NextApiRequest, NextApiResponse } from "next";
import {
  S3Client,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  PutObjectCommand,
  PutObjectCommandInput
} from "@aws-sdk/client-s3";

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.type || !req.body.filename || !req.body.content) return res.status(400).json({ status: "error", error: "request invalid" })
    const R2 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESSKEY,
        secretAccessKey: process.env.S3_SECRETKEY,
      },
    });
    if (req.body.type === "avatar") {
      const fileData = req.body.content.replace(/^data:\w+\/\w+;base64,/, '')
      const decodedFile = Buffer.from(fileData, 'base64')
      const fileExtension = req.body.content.toString().slice(req.body.content.indexOf('/') + 1, req.body.content.indexOf(';'))
      const contentType = req.body.content.toString().slice(req.body.content.indexOf(':') + 1, req.body.content.indexOf(';'))
      if (!contentType.includes("image")) throw new Error("画像タイプが不正です")
      const uploadParams: PutObjectCommandInput = {
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${req.body.type}/${req.body.filename}.${fileExtension}`,
        Body: decodedFile,
        ContentType: contentType
      };
      const uploadRes = await R2.send(new PutObjectCommand(uploadParams));
      return res.status(200).json({ status: "success", url: `${process.env.S3_PUBLIC_URL}/${req.body.type}/${req.body.filename}.${fileExtension}` })
    } else {
      return res.status(400).json({ status: "error", error: "request invalid" })
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}