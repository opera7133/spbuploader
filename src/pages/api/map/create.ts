import { NextApiRequest, NextApiResponse } from "next";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput
} from "@aws-sdk/client-s3";
import { collection, addDoc, getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import { firebaseAdmin } from "@/lib/firebaseAdmin";
import formidable from "formidable";
import { getAuth } from "firebase/auth";
import { getToken } from "next-auth/jwt";
import fs from "fs"
import { createSchema as S, TsjsonParser, Validated } from "ts-json-validator"

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadMap(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(400).json({ status: "error", error: "method not allowed" });
    const token = await getToken({ req, secret: "test" })
    if (!token) return res.status(400).json({ status: "error", error: "not logged in" })
    const user = JSON.parse(JSON.stringify(token, null, 2))
    const form = new formidable.IncomingForm();
    const R2 = new S3Client({
      region: process.env.S3_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.S3_ACCESSKEY,
        secretAccessKey: process.env.S3_SECRETKEY,
      },
    });
    form.parse(req, async function (err, fields, files) {
      if (err) {
        console.error(err)
        return res.status(500).json({ status: "error", error: err });
      }
      const db = getFirestore(firebaseApp)
      const songFile = files["song[file]"]
      const mapFile = files["map[file]"]

      const parser = new TsjsonParser(
        S({
          type: "object",
          properties: {
            title: S({ type: "string" }),
            artist: S({ type: "string" }),
            bgColor: S({ type: "array" }),
            beats: S({ type: "number" }),
            bpm: S({ type: "number" }),
            level: S({ type: "object" }),
            map: S({ type: "object" })
          },
          required: ["title", "artist", "beats", "bpm", "level", "map"]
        })
      );

      const mapData = parser.parse(fs.readFileSync(mapFile.filepath, 'utf8'))

      if (songFile.mimetype !== "audio/mpeg" || mapFile.mimetype !== "application/json") throw new Error("file type not allowed")

      const newDoc = await addDoc(collection(db, "maps"), {
        uid: user.uid,
        map: {
          easy: mapData.level.easy || 0,
          normal: mapData.level.normal || 0,
          hard: mapData.level.hard || 0,
          creator: user.name,
        },
        song: {
          name: fields["song[name]"],
          composer: fields["song[composer]"]
        }
      });

      const mapParams: PutObjectCommandInput = {
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `maps/${newDoc.id}/song.mp3`,
        ContentType: mapFile.mimetype,
        Body: fs.createReadStream(mapFile.filepath)
      };
      const mapUploadRes = await R2.send(new PutObjectCommand(mapParams));

      const musicParams: PutObjectCommandInput = {
        ACL: 'public-read',
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `maps/${newDoc.id}/map.json`,
        ContentType: songFile.mimetype,
        Body: fs.createReadStream(songFile.filepath)
      };
      const musicUploadRes = await R2.send(new PutObjectCommand(musicParams));

      return res.status(200).json({ status: "success", data: newDoc })
    });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}