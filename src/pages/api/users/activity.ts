import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { active } = req.body;

  // Here you would typically update the user's active status in your database.
  console.log("User active status updated to:", active);

  return res.status(200).json({ success: true });
}