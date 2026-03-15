import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 5_242_880);

type ImageKind = {
  ext: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
};

function getUploadDir() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR || "storage/uploads/blog");
}

function detectImageKind(buffer: Buffer): ImageKind | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return { ext: "jpg", mimeType: "image/jpeg" };
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { ext: "png", mimeType: "image/png" };
  }

  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { ext: "webp", mimeType: "image/webp" };
  }

  return null;
}

export async function saveUpload(file: File) {
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Invalid file size");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const imageKind = detectImageKind(buffer);

  if (!imageKind) {
    throw new Error("Unsupported file type");
  }

  const filename = `${randomUUID()}.${imageKind.ext}`;
  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return {
    filename,
    path: `/media/${filename}`,
    size: buffer.byteLength,
    mimeType: imageKind.mimeType,
  };
}

export async function readUploadedFile(filename: string) {
  if (!/^[a-z0-9-]+\.(jpg|png|webp)$/i.test(filename)) {
    return null;
  }

  const absolutePath = path.join(getUploadDir(), filename);

  try {
    const file = await readFile(absolutePath);
    const imageKind = detectImageKind(file);
    if (!imageKind) return null;

    return {
      body: file,
      mimeType: imageKind.mimeType,
    };
  } catch {
    return null;
  }
}
