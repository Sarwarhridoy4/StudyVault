import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { uploadSingleImage, handleUploadError } from '../../middlewares/upload';
import { uploadImage, deleteImage } from '../../services/cloudinary.service';
import type { Request, Response } from 'express';

const router = Router();

// Upload single image to Cloudinary
router.post(
  '/',
  uploadSingleImage,
  handleUploadError,
  catchAsync(async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;

    if (!file) {
      return sendResponse(res, 400, {
        success: false,
        message: 'No file uploaded',
        data: null,
        meta: null,
      });
    }

    // Upload to Cloudinary
    const imageUrl = await uploadImage(file.buffer, 'studyvault/uploads');

    return sendResponse(res, 200, {
      success: true,
      message: 'Image uploaded successfully',
      data: { url: imageUrl },
      meta: null,
    });
  })
);

// Delete image from Cloudinary (by public ID)
router.delete(
  '/:publicId',
  catchAsync(async (req, res) => {
    const { publicId } = req.params as { publicId: string };
    await deleteImage(publicId);
    return sendResponse(res, 200, {
      success: true,
      message: 'Image deleted successfully',
      data: null,
      meta: null,
    });
  })
);

export default router;
