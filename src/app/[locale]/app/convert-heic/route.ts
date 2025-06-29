// import type { NextApiRequest, NextApiResponse } from "next";
// import sharp from "sharp";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const imageUrl = req.query.url as string;

//   if (!imageUrl) {
//     return res.status(400).json({ error: "Missing image URL" });
//   }

//   try {
//     // تحميل الصورة كـ buffer
//     const response = await fetch(imageUrl);
//     if (!response.ok) throw new Error("Failed to fetch image");

//     const imageBuffer = await response.arrayBuffer();

//     // تحويل HEIC إلى JPEG
//     const convertedBuffer = await sharp(Buffer.from(imageBuffer))
//       .jpeg()
//       .toBuffer();

//     res.setHeader("Content-Type", "image/jpeg");
//     res.send(convertedBuffer);
//   } catch (err: any) {
//     console.error("Conversion error:", err);
//     res.status(500).json({ error: "Image conversion failed", message: err.message });
//   }
// }
