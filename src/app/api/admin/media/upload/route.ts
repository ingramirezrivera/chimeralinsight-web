import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { saveUpload } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const alt = String(formData.get("alt") || "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const uploaded = await saveUpload(file);

    await prisma.media.create({
      data: {
        filename: uploaded.filename,
        path: uploaded.path,
        mimeType: uploaded.mimeType,
        size: uploaded.size,
        alt: alt || null,
        uploadedById: session.userId,
      },
    });

    return NextResponse.json({
      url: uploaded.path,
      alt,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to upload file" },
      { status: 400 }
    );
  }
}
