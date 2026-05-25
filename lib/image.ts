import { createHash } from 'crypto';
import sharp from 'sharp';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);
export const ALLOWED_DOCUMENT_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

export type UploadCategory =
  | 'student'
  | 'staff'
  | 'program'
  | 'facility'
  | 'logo'
  | 'document'
  | 'general';

const CATEGORY_MAX_WIDTH: Record<UploadCategory, number> = {
  student: 800,
  staff: 800,
  program: 1200,
  facility: 1600,
  logo: 512,
  document: 1200,
  general: 1920,
};

export function hashBuffer(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex').slice(0, 24);
}

export function sanitizeBaseName(name: string): string {
  return name
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
    .toLowerCase();
}

export function isImageMime(mime: string): boolean {
  return ALLOWED_IMAGE_TYPES.has(mime.toLowerCase());
}

export async function optimizeImage(
  input: Buffer,
  mime: string,
  category: UploadCategory = 'general'
): Promise<{ buffer: Buffer; ext: string; contentHash: string }> {
  const contentHash = hashBuffer(input);
  const maxWidth = CATEGORY_MAX_WIDTH[category] ?? 1920;

  const image = sharp(input, { failOn: 'none' });
  const metadata = await image.metadata();

  let pipeline = image.rotate();

  if (metadata.width && metadata.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, undefined, {
      withoutEnlargement: true,
      fit: 'inside',
    });
  }

  const hasAlpha = metadata.hasAlpha && mime.includes('png');

  if (category === 'logo' || hasAlpha) {
    const buffer = await pipeline
      .png({ quality: 85, compressionLevel: 9, palette: category === 'logo' })
      .toBuffer();
    return { buffer, ext: 'png', contentHash };
  }

  const buffer = await pipeline.webp({ quality: 82, effort: 4 }).toBuffer();
  return { buffer, ext: 'webp', contentHash };
}
