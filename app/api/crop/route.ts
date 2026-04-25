import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("CROP BODY keys:", Object.keys(body));

    const base64 = body.imageUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

    // get actual image dimensions first
    const metadata = await sharp(buffer).metadata();
    console.log("IMAGE SIZE:", metadata.width, "x", metadata.height);

    const cropWidth = Math.min(body.width || 200, metadata.width!);
    const cropHeight = Math.min(body.height || 200, metadata.height!);

    const cropped = await sharp(buffer)
      .extract({
        left: body.x || 0,
        top: body.y || 0,
        width: cropWidth,
        height: cropHeight,
      })
      .jpeg()
      .toBuffer();

    return NextResponse.json({
      output: `data:image/jpeg;base64,${cropped.toString("base64")}`,
    });
  } catch (err: any) {
    console.error("CROP ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}