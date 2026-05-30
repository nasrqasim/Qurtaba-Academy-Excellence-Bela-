import { v2 as cloudinary } from 'cloudinary';
import type { UploadCategory } from '@/lib/image';

const ROOT_FOLDER = 'qurtaba-school';

let configured = false;

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
  );
}

function ensureConfigured(): void {
  if (configured) return;
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    const matches = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (matches) {
      const [, apiKey, apiSecret, cloudName] = matches;
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
    } else {
      cloudinary.config({ secure: true });
    }
  } else {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  configured = true;
}

export function cloudinaryFolder(category: UploadCategory): string {
  return `${ROOT_FOLDER}/${category}`;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    category: UploadCategory;
    publicId: string;
    resourceType?: 'image' | 'raw';
    mime?: string;
  }
): Promise<{ url: string; publicId: string; size: number; provider: 'cloudinary' }> {
  ensureConfigured();

  const folder = cloudinaryFolder(options.category);
  const fullPublicId = `${folder}/${options.publicId}`;
  const resourceType = options.resourceType ?? 'image';

  try {
    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      bytes: number;
    }>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: options.publicId,
          resource_type: resourceType,
          overwrite: false,
          unique_filename: false,
          use_filename: false,
          ...(resourceType === 'image'
            ? {
                fetch_format: 'auto',
                quality: 'auto:good',
              }
            : {}),
        },
        (err, res) => {
          if (err) reject(err);
          else if (!res) reject(new Error('Empty Cloudinary response'));
          else resolve(res);
        }
      );
      upload.end(buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      size: result.bytes,
      provider: 'cloudinary',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('already exists') || msg.includes('Resource with the given public ID')) {
      const url = cloudinary.url(fullPublicId, {
        secure: true,
        resource_type: resourceType,
      });
      return {
        url,
        publicId: fullPublicId,
        size: buffer.length,
        provider: 'cloudinary',
      };
    }
    throw err;
  }
}
