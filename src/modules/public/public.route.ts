import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const router = Router();

// Landing page data
router.get(
  '/',
  catchAsync(async (_req, res) => {
    return sendResponse(res, 200, {
      success: true,
      message: 'Welcome to StudyVault',
      data: {
        name: 'StudyVault API',
        version: '1.0.0',
        description: 'A learning-item marketplace',
        endpoints: {
          health: '/health',
          api: '/api/v1',
          items: '/api/v1/items',
          about: '/api/v1/about',
        },
      },
      meta: null,
    });
  })
);

// About page content
router.get(
  '/about',
  catchAsync(async (_req, res) => {
    return sendResponse(res, 200, {
      success: true,
      message: 'About StudyVault',
      data: {
        name: 'StudyVault',
        tagline: 'Your gateway to learning',
        description: 'StudyVault is a marketplace for learning items where users can browse, create, and manage study materials.',
        features: [
          'Browse study items by category',
          'Search and filter items',
          'Add and manage your own items',
          'Admin control panel',
        ],
        apiVersion: '1.0.0',
      },
      meta: null,
    });
  })
);

export default router;
