import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { assertUploadRateLimit } from "@/lib/security/upload-rate-limit";
import { saveUpload } from "@/lib/storage";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "unknown";
    const rateLimitKey = `${session.userId}:${clientIp}`;

    if (!assertUploadRateLimit(rateLimitKey)) {
      return NextResponse.json({ error: "Too many upload attempts" }, { status: 429 });
    }

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
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unable to upload file";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
