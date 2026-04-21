import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "sabores-de-esperanza",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
