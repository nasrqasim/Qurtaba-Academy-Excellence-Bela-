import { NextResponse } from 'next/server';
import { access, mkdir, writeFile } from 'fs/promises';
import path from 'path';
import {
  ALLOWED_DOCUMENT_TYPES,
  ALLOWED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
  hashBuffer,
  isImageMime,
  optimizeImage,
  sanitizeBaseName,
  type UploadCategory,
} from '@/lib/image';
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const maxDuration = 60;

const VALID_CATEGORIES = new Set<UploadCategory>([
  'student',
  'staff',
  'program',
  'facility',
  'logo',
  'document',
  'general',
]);

async function saveLocal(
  outputBuffer: Buffer,
  category: UploadCategory,
  contentHash: string,
  baseName: string,
  ext: string,
  isImage: boolean
) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const filename = `${category}-${contentHash}-${baseName}.${ext}`;
  const filePath = path.join(uploadDir, filename);
  const publicUrl = `/uploads/${filename}`;

  try {
    await access(filePath);
    return NextResponse.json({
      message: 'File already exists (duplicate prevented)',
      url: publicUrl,
      duplicate: true,
      optimized: isImage,
      provider: 'local',
    });
  } catch {
    await writeFile(filePath, outputBuffer);
    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        url: publicUrl,
        optimized: isImage,
        size: outputBuffer.length,
        provider: 'local',
      },
      { status: 201 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const categoryRaw = (formData.get('category') as string) || 'general';
    const category = VALID_CATEGORIES.has(categoryRaw as UploadCategory)
      ? (categoryRaw as UploadCategory)
      : 'general';

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { message: `File too large. Maximum size is ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    const mime = (file.type || 'application/octet-stream').toLowerCase();
    const isImage = isImageMime(mime);
    const allowed = isImage ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;

    if (!allowed.has(mime)) {
      return NextResponse.json(
        { message: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, or PDF for documents' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const inputBuffer = Buffer.from(bytes);
    const contentHash = hashBuffer(inputBuffer);
    const baseName = sanitizeBaseName(file.name);
    const publicId = `${category}-${contentHash}-${baseName}`;

    let outputBuffer = inputBuffer;
    let ext = path.extname(file.name).replace('.', '') || 'bin';

    if (isImage) {
      const optimized = await optimizeImage(inputBuffer, mime, category);
      outputBuffer = Buffer.from(optimized.buffer);
      ext = optimized.ext;
    }

    if (isCloudinaryConfigured()) {
      const uploaded = await uploadToCloudinary(outputBuffer, {
        category,
        publicId,
        resourceType: isImage ? 'image' : 'raw',
        mime,
      });

      return NextResponse.json(
        {
          message: 'File uploaded to Cloudinary',
          url: uploaded.url,
          optimized: isImage,
          size: uploaded.size,
          provider: uploaded.provider,
          publicId: uploaded.publicId,
        },
        { status: 201 }
      );
    }

    return saveLocal(outputBuffer, category, contentHash, baseName, ext, isImage);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ message }, { status: 500 });
  }
}
