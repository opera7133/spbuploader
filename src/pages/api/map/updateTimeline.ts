import { NextApiRequest, NextApiResponse } from "next";
import { doc, updateDoc, getFirestore, getDoc } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase";
import { getToken } from "next-auth/jwt";
import { csrf } from '@/lib/csrf';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function updateTimeline(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") return res.status(400).json({ status: "error", error: "method not allowed" });
    if (!req.query.id || !req.query.timeline) throw new Error("id not provided")
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return res.status(400).json({ status: "error", error: "not logged in" })
    const user = JSON.parse(JSON.stringify(token, null, 2))
    const db = getFirestore(firebaseApp)
    const testDoc = (await getDoc(doc(db, "maps", req.query.id.toString()))).data()
    if (!testDoc || testDoc.uid !== user.uid) throw new Error("user id does not match")
    const docRes = await updateDoc(doc(db, "maps", req.query.id.toString()), {
      timeline: req.query.timeline.toString().replace(
        "https://sparebeat.com/embed/timeline/",
        ""
      )
    });

    return res.status(200).json({ status: "success", data: docRes })
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(updateTimeline);