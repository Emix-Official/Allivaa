import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      path: "/",
      httpOnly: true,
      maxAge: 0,
    })
  );
  res.status(200).json({ ok: true });
}
