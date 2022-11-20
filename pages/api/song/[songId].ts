import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../auth-config";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { songId } = req.query;
  const startPosition = await redis.get(
    `user:${session.userId}:song:${songId}`
  );
  res.status(200).json({ startPosition });
};

export default handler;
