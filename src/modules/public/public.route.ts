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
        description: 'A learning platform marketplace',
        endpoints: {
          health: '/health',
          api: '/api/v1',
          courses: '/api/v1/courses',
          modules: '/api/v1/modules',
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
        description: 'StudyVault is a marketplace for learning modules where users can browse, create, and manage course materials.',
        features: [
          'Browse courses and modules by category',
          'Search and filter content',
          'Add and manage your own modules',
          'Admin control panel for course-module linking',
        ],
        apiVersion: '1.0.0',
      },
      meta: null,
    });
  })
);

export default router;
