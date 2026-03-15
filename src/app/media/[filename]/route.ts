import { NextResponse } from "next/server";
import { readUploadedFile } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const file = await readUploadedFile(filename);

  if (!file) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(file.body, {
    status: 200,
    headers: {
      "Content-Type": file.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
