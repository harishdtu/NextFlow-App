import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const ALLOWED_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-2.5-flash-preview-tts"
];

const schema = z.object({
  userMessage: z.string().optional().default(""),
  systemPrompt: z.string().optional().default(""),
  model: z.string().optional().default("gemini-2.0-flash"),
  images: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { userMessage, systemPrompt, model, images } = parsed.data;

    // Ensure model is allowed
    const safeModel = ALLOWED_MODELS.includes(model) ? model : "gemini-2.0-flash";

    console.log("LLM BODY:", { userMessage, model: safeModel, images: images.length });

    const parts: any[] = [];

    if (userMessage) parts.push({ text: userMessage });

    if (images && images.length > 0) {
      for (const img of images) {
        if (!img) continue;
        const base64 = img.includes(",") ? img.split(",")[1] : img;
        parts.push({
          inlineData: { mimeType: "image/jpeg", data: base64 },
        });
      }
    }

    const geminiModel = genAI.getGenerativeModel({
      model: safeModel,
      ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
    });

    const result = await geminiModel.generateContent({ contents: [{ role: "user", parts }] });
    const text = result.response.text();

    return NextResponse.json({ output: text });
  } catch (err: any) {
    console.error("LLM ERROR:", err.message);
    return NextResponse.json({ error: err.message || "LLM failed" }, { status: 500 });
  }
}