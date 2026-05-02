import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
<<<<<<< HEAD
=======
    console.log("CROP BODY keys:", Object.keys(body));
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4

    const base64 = body.imageUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");

<<<<<<< HEAD
    const metadata = await sharp(buffer).metadata();
    const imgW = metadata.width || 100;
    const imgH = metadata.height || 100;

    // Use percentage params from node (0-100), default to full image
    const xPct = parseFloat(body.x ?? body.cropX ?? 0) / 100;
    const yPct = parseFloat(body.y ?? body.cropY ?? 0) / 100;
    const wPct = parseFloat(body.width ?? body.cropW ?? 100) / 100;
    const hPct = parseFloat(body.height ?? body.cropH ?? 100) / 100;

    const left = Math.round(imgW * xPct);
    const top = Math.round(imgH * yPct);
    const width = Math.min(Math.round(imgW * wPct), imgW - left);
    const height = Math.min(Math.round(imgH * hPct), imgH - top);

    console.log("CROP PARAMS:", { left, top, width, height, imgW, imgH });

    const cropped = await sharp(buffer)
      .extract({ left, top, width, height })
=======
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
>>>>>>> a852c9a93198feb36e493eafa9501773fc569eb4
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