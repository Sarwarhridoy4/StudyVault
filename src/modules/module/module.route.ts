import { Router } from 'express';
import { moduleController } from './module.controller';
import auth from '../../middlewares/auth';
import { validate } from '../../middlewares/validation';
import { sanitizeBody } from '../../middlewares/sanitize';
import { moduleClientSchema, moduleUpdateSchema } from './module.validation';

const router = Router();

// Public routes (no auth required)
router.get('/', moduleController.getAllModules);
router.get('/:id', moduleController.getModuleById);

// Protected routes - require authentication
router.get('/manage', auth, moduleController.getUserModules);

router.post(
  '/add',
  auth,
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'image']),
  validate(moduleClientSchema),
  moduleController.createModule
);

router.patch(
  '/:id',
  auth,
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'image']),
  validate(moduleUpdateSchema),
  moduleController.updateModule
);

router.delete('/:id', auth, moduleController.deleteModule);

export default router;
