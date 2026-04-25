import { NextResponse } from "next/server";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import os from "os";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
  }
}