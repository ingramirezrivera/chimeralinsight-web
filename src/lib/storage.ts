import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 5_242_880);
const MAX_UPLOAD_DIMENSION = Number(process.env.MAX_UPLOAD_DIMENSION || 2200);
const WEBP_QUALITY = Number(process.env.UPLOAD_WEBP_QUALITY || 82);
const DEFAULT_MEDIA_ROOT = "storage/media";

type ImageKind = {
  ext: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
};

function getMediaRootDir() {
  const configuredRoot =
    process.env.MEDIA_ROOT_DIR || process.env.UPLOAD_DIR || DEFAULT_MEDIA_ROOT;

  return path.resolve(process.cwd(), configuredRoot);
}

function getMediaOriginalsDir() {
  return path.join(getMediaRootDir(), "originals");
}

function getMediaDerivativesDir() {
  return path.join(getMediaRootDir(), "derivatives");
}

function getMediaTempDir() {
  return path.join(getMediaRootDir(), "temp");
}

async function ensureMediaDirectories() {
  await Promise.all([
    mkdir(getMediaOriginalsDir(), { recursive: true }),
    mkdir(getMediaDerivativesDir(), { recursive: true }),
    mkdir(getMediaTempDir(), { recursive: true }),
  ]);
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

async function optimizeImage(buffer: Buffer) {
  const pipeline = sharp(buffer, { failOn: "error" }).rotate();
  const metadata = await pipeline.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Unable to read image dimensions");
  }

  const optimized = await pipeline
    .resize({
      width: MAX_UPLOAD_DIMENSION,
      height: MAX_UPLOAD_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: WEBP_QUALITY,
      effort: 4,
    })
    .toBuffer();

  if (optimized.byteLength > MAX_UPLOAD_BYTES) {
    throw new Error("Optimized image is still too large");
  }

  const optimizedMetadata = await sharp(optimized).metadata();

  return {
    body: optimized,
    width: optimizedMetadata.width || metadata.width,
    height: optimizedMetadata.height || metadata.height,
  };
}

export async function saveUpload(file: File) {
  if (file.size === 0) {
    throw new Error("Invalid file size");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const imageKind = detectImageKind(buffer);

  if (!imageKind) {
    throw new Error("Unsupported file type");
  }

  const optimized = await optimizeImage(buffer);
  const filename = `${randomUUID()}.webp`;
  await ensureMediaDirectories();
  await writeFile(path.join(getMediaOriginalsDir(), filename), optimized.body);

  return {
    filename,
    path: `/media/${filename}`,
    size: optimized.body.byteLength,
    width: optimized.width,
    height: optimized.height,
    mimeType: "image/webp" as const,
  };
}

export async function readUploadedFile(filename: string) {
  if (!/^[a-z0-9-]+\.(jpg|png|webp)$/i.test(filename)) {
    return null;
  }

  const absolutePath = path.join(getMediaOriginalsDir(), filename);

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

export function getMediaStorageLayout() {
  return {
    rootDir: getMediaRootDir(),
    originalsDir: getMediaOriginalsDir(),
    derivativesDir: getMediaDerivativesDir(),
    tempDir: getMediaTempDir(),
    maxUploadBytes: MAX_UPLOAD_BYTES,
    maxUploadDimension: MAX_UPLOAD_DIMENSION,
    webpQuality: WEBP_QUALITY,
  };
}
