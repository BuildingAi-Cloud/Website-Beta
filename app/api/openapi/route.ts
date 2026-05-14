import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import path from "node:path";

export const dynamic = "force-static";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  const filePath = path.join(process.cwd(), "public", "openapi.yaml");
  const yaml = await readFile(filePath, "utf-8");
  return new NextResponse(yaml, {
    status: 200,
    headers: {
      "Content-Type": "application/yaml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      ...CORS,
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
