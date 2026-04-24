import cloudinary from '../config/cloudinary';
import CloudinaryError from '../errors/CloudinaryError';
import { Readable } from 'stream';

// Accept Buffer for direct upload, or string URL for remote fetch
export const uploadImage = async (file: Buffer | string, folder: string = 'studyvault'): Promise<string> => {
  try {
    const uploadOptions = {
      folder,
      resource_type: 'image' as const,
      transformation: [
        { width: 800, height: 600, crop: 'limit' as const },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    };

    let result: any;

    if (Buffer.isBuffer(file)) {
      // Upload from Buffer using upload_stream
      const stream = Readable.from(file);
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.pipe(uploadStream);
      });
    } else {
      // Upload from file path or URL using regular upload
      result = await cloudinary.uploader.upload(file, uploadOptions);
    }

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new CloudinaryError('Image upload failed');
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new CloudinaryError('Image deletion failed');
  }
};
