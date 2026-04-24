import { uploadImage, deleteImage } from './cloudinary.service';

export interface UploadedImage {
  url: string;
  publicId: string;
}

/**
 * Upload image with automatic rollback capability
 * Returns both URL and publicId for later deletion
 */
export const uploadImageWithRollback = async (
  file: Buffer | string,
  folder: string = 'studyvault'
): Promise<UploadedImage> => {
  const result = await uploadImage(file, folder);
  
  // Extract publicId from URL
  // Cloudinary URLs: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/filename.jpg
  // or with folder: https://res.cloudinary.com/{cloud_name}/image/upload/v1234567890/folder/filename.jpg
  
  const urlParts = result.split('/');
  const versionIndex = urlParts.findIndex(part => part.startsWith('v'));
  let publicId = '';
  
  if (versionIndex !== -1 && versionIndex < urlParts.length - 1) {
    // Join everything after the version part
    publicId = urlParts.slice(versionIndex + 1).join('/').replace(/\.[^/.]+$/, '');
  } else {
    // Fallback: extract filename without extension
    publicId = result.split('/').pop()?.replace(/\.[^/.]+$/, '') || '';
  }
  
  // If the result includes 'folder/' in it, add it to publicId
  if (folder !== 'studyvault' && folder !== 'studyvault/uploads') {
    const folderPart = result.includes(`/${folder}/`) ? `${folder}/` : '';
    if (folderPart && !publicId.startsWith(folder)) {
      publicId = folderPart + publicId;
    }
  }
  
  return { url: result, publicId };
};

/**
 * Safe delete - doesn't throw on failure, just logs
 */
export const safeDeleteImage = async (publicId: string): Promise<boolean> => {
  try {
    await deleteImage(publicId);
    return true;
  } catch (error) {
    console.error(`Failed to delete image ${publicId}:`, error);
    return false;
  }
};

/**
 * Update image with automatic rollback
 * 1. Upload new image
 * 2. Delete old image
 * 3. If any step fails, attempts to rollback
 */
export const updateImageWithRollback = async (
  newFile: Buffer | string,
  oldPublicId: string | null | undefined,
  folder: string = 'studyvault'
): Promise<UploadedImage> => {
  // Step 1: Upload new image
  const newImage = await uploadImageWithRollback(newFile, folder);
  
  try {
    // Step 2: Delete old image (if exists)
    if (oldPublicId) {
      await safeDeleteImage(oldPublicId);
    }
    return newImage;
  } catch (error) {
    // Step 3: Rollback - delete new image since old one was deleted
    console.error('Failed to delete old image, rolling back new image upload');
    await safeDeleteImage(newImage.publicId);
    throw new Error('Image update failed: could not replace old image');
  }
};

/**
 * Transaction helper for course creation with image
 * Uploads image and ensures it's deleted if DB operation fails
 */
export const createWithImageTransaction = async <T>(
  imageFile: Buffer | string,
  dbOperation: (imageUrl: string, imagePublicId: string) => Promise<T>,
  folder: string = 'studyvault'
): Promise<{ data: T; image: UploadedImage }> => {
  // Step 1: Upload image
  const uploadedImage = await uploadImageWithRollback(imageFile, folder);
  
  try {
    // Step 2: Perform DB operation
    const result = await dbOperation(uploadedImage.url, uploadedImage.publicId);
    return { data: result, image: uploadedImage };
  } catch (error) {
    // Step 3: Rollback - delete uploaded image
    console.error('DB operation failed, rolling back image upload:', error);
    await safeDeleteImage(uploadedImage.publicId);
    throw error;
  }
};

/**
 * Transaction helper for course update with optional image change
 */
export const updateWithImageTransaction = async <T>(
  updateData: {
    newImageFile?: Buffer | string;
    oldImagePublicId?: string | null;
  },
  dbOperation: (imageUrl?: string, imagePublicId?: string) => Promise<T>,
  folder: string = 'studyvault'
): Promise<{ data: T; image?: UploadedImage }> => {
  let uploadedImage: UploadedImage | undefined;
  
  try {
    // Step 1: If updating image, upload new one and delete old
    if (updateData.newImageFile) {
      uploadedImage = await uploadImageWithRollback(updateData.newImageFile, folder);
      
      // Delete old image if exists
      if (updateData.oldImagePublicId) {
        await safeDeleteImage(updateData.oldImagePublicId);
      }
    }
    
    // Step 2: Perform DB operation
    const result = await dbOperation(uploadedImage?.url, uploadedImage?.publicId);
    return { data: result, image: uploadedImage };
  } catch (error) {
    // Step 3: Rollback
    if (uploadedImage) {
      console.error('DB update failed, rolling back new image:', error);
      await safeDeleteImage(uploadedImage.publicId);
      
      // Note: We cannot restore the old image since it was already deleted
      // This is a known limitation - in production, consider soft deletes or backup
    }
    throw error;
  }
};

/**
 * Transaction helper for course deletion with image cleanup
 */
export const deleteWithImageCleanup = async <T>(
  imagePublicId: string | null | undefined,
  dbOperation: () => Promise<T>
): Promise<{ data: T; imageDeleted: boolean }> => {
  let imageDeleted = false;
  
  try {
    // Step 1: Delete from database first
    const result = await dbOperation();
    
    // Step 2: Try to delete image (non-critical failure)
    if (imagePublicId) {
      imageDeleted = await safeDeleteImage(imagePublicId);
      if (!imageDeleted) {
        console.warn(`Image ${imagePublicId} was not deleted. Manual cleanup may be required.`);
      }
    }
    
    return { data: result, imageDeleted };
  } catch (error) {
    // If DB delete fails, don't delete the image
    console.error('DB delete failed, image preserved:', error);
    throw error;
  }
};
