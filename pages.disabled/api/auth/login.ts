import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const SECRET = process.env.JWT_SECRET || "DEV_SECRET";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;

  // TODO: replace with real credential check
  if (email && password) {
    const payload = { email, role: "user" };
    const token = jwt.sign(payload, SECRET, { expiresIn: "8h" });
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 8,
      })
    );
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ error: "Invalid credentials" });
}
