import { NextRequest, NextResponse } from "next/server";
import hljs from "highlight.js";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "No snippet provided" },
        { status: 400 },
      );
    }

    const detected = hljs.highlightAuto(code);

    return NextResponse.json({
      language: detected.language || "plaintext",
    });
  } catch (error) {
    console.error("Language detection error:", error);
    return NextResponse.json(
      { error: "Failed to detect language" },
      { status: 500 },
    );
  }
}
