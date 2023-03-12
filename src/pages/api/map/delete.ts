import { NextApiRequest, NextApiResponse } from "next";
import {
  S3Client,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput
} from "@aws-sdk/client-s3";
import { doc, getDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import { getToken } from "next-auth/jwt";
import { csrf } from '@/lib/csrf';

async function deleteMap(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(400).json({ status: "error", error: "method not allowed" });
    if (!req.query.id) throw new Error("id not provided")
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return res.status(400).json({ status: "error", error: "not logged in" })

    const user = JSON.parse(JSON.stringify(token, null, 2))
    const db = getFirestore(firebaseApp)
    const docRef = doc(db, "maps", req.query.id.toString())
    const deleteDocQuery = await getDoc(docRef)
    const deleteDocData = deleteDocQuery.data()
    if (!deleteDocData || deleteDocData.uid !== user.uid) throw new Error("user id does not match")
    await deleteDoc(docRef);

    const R2 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESSKEY,
        secretAccessKey: process.env.S3_SECRETKEY,
      },
    });
    const deleteMaps: DeleteObjectsCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME,
      Delete: {
        Objects: [{
          Key: `maps/${req.query.id}/map.json`
        }, {
          Key: `maps/${req.query.id}/song.mp3`
        }]
      }
    };
    const deleteMapsRes = await R2.send(new DeleteObjectsCommand(deleteMaps));
    return res.status(200).json({ status: "success", data: deleteDocData })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(deleteMap);