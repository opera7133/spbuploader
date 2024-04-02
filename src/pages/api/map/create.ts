import { NextApiRequest, NextApiResponse } from "next";
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import {
  collection,
  addDoc,
  getFirestore,
  Timestamp,
} from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import formidable from "formidable";
import { getToken } from "next-auth/jwt";
import fs from "fs";
import { createSchema as S, TsjsonParser } from "ts-json-validator";
import { csrf } from "@/lib/csrf";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadMap(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST")
      return res
        .status(400)
        .json({ status: "error", error: "method not allowed" });
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token)
      return res.status(400).json({ status: "error", error: "not logged in" });
    const user = JSON.parse(JSON.stringify(token, null, 2));
    const form = formidable();
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
        console.error(err);
        return res.status(500).json({ status: "error", error: err });
      }
      try {
        const db = getFirestore(firebaseApp);
        const songFile = files["song[file]"]![0];
        const mapFile = files["map[file]"]![0];

        const parser = new TsjsonParser(
          S({
            type: "object",
            properties: {
              title: S({ type: "string" }),
              artist: S({ type: "string" }),
              url: S({ type: "string" }),
              bgColor: S({ type: "array" }),
              beats: S({ type: "number" }),
              bpm: S({ type: "number" }),
              startTime: S({ type: "number" }),
              level: S({ type: "object" }),
              map: S({ type: "object" }),
            },
            required: ["title", "artist", "beats", "bpm", "level", "map"],
          })
        );

        //@ts-ignore
        const mapData = parser.parse(fs.readFileSync(mapFile.filepath, "utf8"));

        //@ts-ignore
        if (
          songFile.mimetype !== "audio/mpeg" ||
          mapFile.mimetype !== "application/json"
        )
          throw new Error("file type not allowed");
        const newDoc = await addDoc(collection(db, "maps"), {
          favoritesCount: 0,
          uid: user.uid,
          map: {
            easy: mapData.level.easy,
            normal: mapData.level.normal,
            hard: mapData.level.hard,
            creator: user.name,
            //@ts-ignore
            fileName: mapFile.originalFilename,
            desc: fields["map[desc]"]?.toString().replace(/\n/g, ""),
          },
          song: {
            name: fields["song[name]"] || mapData.title,
            //@ts-ignore
            fileName: songFile.originalFilename,
            composer: fields["song[composer]"] || mapData.artist,
            composerUrl: mapData.url || "",
          },
          createdAt: Timestamp.fromDate(new Date()),
        });

        const mapParams: PutObjectCommandInput = {
          ACL: "public-read",
          Bucket: process.env.S3_BUCKET_NAME,
          //@ts-ignore
          Key: `maps/${newDoc.id}/${mapFile.originalFilename}`,
          //@ts-ignore
          ContentType: mapFile.mimetype,
          //@ts-ignore
          Body: fs.createReadStream(mapFile.filepath),
        };
        const mapUploadRes = await R2.send(new PutObjectCommand(mapParams));

        const musicParams: PutObjectCommandInput = {
          ACL: "public-read",
          Bucket: process.env.S3_BUCKET_NAME,
          //@ts-ignore
          Key: `maps/${newDoc.id}/${songFile.originalFilename}`,
          //@ts-ignore
          ContentType: songFile.mimetype,
          //@ts-ignore
          Body: fs.createReadStream(songFile.filepath),
        };
        const musicUploadRes = await R2.send(new PutObjectCommand(musicParams));

        return res.status(200).json({ status: "success", id: newDoc.id });
      } catch (e) {
        if (e instanceof Error) {
          return res.status(500).json({ status: "error", error: e.message });
        } else {
          return res.status(500).json({ status: "error", error: e });
        }
      }
    });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message });
    } else {
      return res.status(500).json({ status: "error", error: e });
    }
  }
}

export default csrf(uploadMap);
