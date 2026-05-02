import { NextResponse } from "next/server";
<<<<<<< HEAD
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});
=======
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import os from "os";
import path from "path";
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4

export async function POST(req: Request) {
  try {
    const body = await req.json();

<<<<<<< HEAD
    let videoUrl: string = body.video;
    let timestamp = body.timestamp ?? "1";

    if (!videoUrl) {
      return NextResponse.json({ error: "No video URL" }, { status: 400 });
    }

    timestamp = String(timestamp).trim();

    console.log("🎯 RAW TIMESTAMP:", timestamp);

    // Convert % → seconds (approx fallback)
    if (timestamp.includes("%")) {
      const percent = parseInt(timestamp.replace("%", ""));
      const duration = 5; // fallback if unknown
      const sec = Math.max(1, Math.floor((percent / 100) * duration));
      timestamp = String(sec);
    }

    console.log("🔥 FINAL TIMESTAMP:", timestamp);

    if (videoUrl.includes("cloudinary.com")) {
      const match = videoUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
      const publicId = match?.[1];

      if (!publicId) {
        throw new Error("Invalid Cloudinary URL");
      }

      const frameUrl = cloudinary.url(publicId, {
        resource_type: "video",
        format: "jpg",
        transformation: [
          {
            start_offset: parseFloat(timestamp), // ✅ IMPORTANT
            width: 400,                         // 👈 fix size
            crop: "scale",
            quality: "auto",
          },
        ],
      });

      console.log("🖼 FRAME URL:", frameUrl);

      return NextResponse.json({ output: frameUrl });
    }

    throw new Error("Only Cloudinary URLs supported");
  } catch (err: any) {
    console.error("FRAME ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
=======
    const base64 = body.video.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `input_${Date.now()}.mp4`);
    const outputPath = path.join(tmpDir, `frame_${Date.now()}.jpg`);

    fs.writeFileSync(inputPath, buffer);

    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .seekInput(body.timestamp || 1)
        .frames(1)
        .output(outputPath)
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    const file = fs.readFileSync(outputPath);
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    return NextResponse.json({
      output: `data:image/jpeg;base64,${file.toString("base64")}`,
    });
  } catch (err) {
    console.error("FRAME ERROR:", err);
    return NextResponse.json({ error: "Frame failed" }, { status: 500 });
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
  }
}