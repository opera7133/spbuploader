import { NextApiRequest, NextApiResponse } from "next";
import { doc, updateDoc, getFirestore, getDoc, setDoc, increment } from "firebase/firestore";
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
    if (!req.query.id || !req.query.fav) throw new Error("id not provided")
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) return res.status(400).json({ status: "error", error: "not logged in" })
    const user = JSON.parse(JSON.stringify(token, null, 2))
    const db = getFirestore(firebaseApp)
    const userDoc = doc(db, "users", user.uid)
    const mapDoc = doc(db, "maps", req.query.id.toString())
    const testDoc = (await getDoc(userDoc)).data()
    if (req.query.fav === "false") {
      if (testDoc) {
        const docRes = await updateDoc(userDoc, {
          favorites: testDoc.favorites ? [...testDoc.favorites, mapDoc] : [mapDoc]
        })
        const mapRes = await updateDoc(mapDoc, {
          favoritesCount: increment(1)
        })
        return res.status(200).json({ status: "success", data: docRes })
      } else {
        const docRes = await setDoc(userDoc, {
          favorites: [doc(db, "maps", req.query.id.toString())]
        })
        const mapRes = await updateDoc(mapDoc, {
          favoritesCount: increment(1)
        })
        return res.status(200).json({ status: "success", data: docRes })
      }
    } else {
      if (testDoc) {
        const docRes = await updateDoc(userDoc, {
          favorites: await Promise.all(testDoc.favorites.map(async (fav: any) => {
            const favData = await getDoc(fav)
            return favData.id !== req.query.id
          })).then(fav => testDoc.favorites.filter(() => fav.shift()))
        })
        const mapRes = await updateDoc(mapDoc, {
          favoritesCount: increment(-1)
        })
        return res.status(200).json({ status: "success", data: docRes })
      }
    }

  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(updateTimeline);