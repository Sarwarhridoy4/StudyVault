import { Router } from 'express';
import { moduleController } from './module.controller';
import { validate } from '../../middlewares/validation';
import { sanitizeBody } from '../../middlewares/sanitize';
import { moduleClientSchema, moduleUpdateSchema } from './module.validation';

const router = Router();

// Public routes (no auth required)
// IMPORTANT: /manage must come BEFORE /:id to avoid route conflict
router.get('/manage', moduleController.getUserModules);
router.get('/', moduleController.getAllModules);
router.get('/:id', moduleController.getModuleById);

// User protected routes (sanitize + validate before controller)
router.post(
  '/add',
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'image']),
  validate(moduleClientSchema),
  moduleController.createModule
);

router.patch(
  '/:id',
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'image']),
  validate(moduleUpdateSchema),
  moduleController.updateModule
);

router.delete('/:id', moduleController.deleteModule);

export default router;
