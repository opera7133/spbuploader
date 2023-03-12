import { NextApiRequest, NextApiResponse } from "next";
import { csrf } from "@/lib/csrf";
import { firebaseAdmin } from "@/lib/firebaseAdmin";

async function setRole(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.body.id || !req.body.role) return res.status(400).json({ status: "error", error: "request invalid" });
    const user = await firebaseAdmin.auth().getUser(req.body.id.toString());
    if (!user) throw new Error("user not found");
    if (!user.customClaims?.roles.includes("admin")) throw new Error("not allowed")
    const customClaims = user.customClaims?.roles || [""]
    const data = typeof req.body.role === "string" ? [...customClaims, req.body.role] : [...customClaims, ...req.body.role];
    const setRoleRes = await firebaseAdmin.auth().setCustomUserClaims(req.body.id.toString(), { roles: Array.from(new Set(data)).filter(Boolean) });
    return res.status(200).json({ status: "success" });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ status: "error", error: e.message })
    } else {
      return res.status(500).json({ status: "error", error: e })
    }
  }
}

export default csrf(setRole);