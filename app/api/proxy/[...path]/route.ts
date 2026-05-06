import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_BASEURL!;

async function handler(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const { path } = await params;
  const apiPath = path.join("/");
  const search = request.nextUrl.search;
  const url = `${API_BASE}/${apiPath}${search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const body =
    request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

  const response = await fetch(url, {
    method:  request.method,
    headers,
    body,
  });

  const data = await response.text();

  return new NextResponse(data, {
    status:  response.status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET    = handler;
export const POST   = handler;
export const PUT    = handler;
export const PATCH  = handler;
export const DELETE = handler;
