import cloudinary from '../config/cloudinary';

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

    const result = await (cloudinary.uploader.upload as (file: Buffer | string, options?: any) => Promise<any>)(file, uploadOptions);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};
