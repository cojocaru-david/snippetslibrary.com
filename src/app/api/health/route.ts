import { NextResponse } from "next/server";
import packageJson from "@/../package.json";

export async function GET() {
  try {
    const healthData = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: packageJson.version,
    };

    return NextResponse.json(healthData, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
