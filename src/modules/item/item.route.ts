import { Router } from 'express';
import { itemController } from './item.controller';
import { validate } from '../../middlewares/validation';
import { sanitizeBody } from '../../middlewares/sanitize';
import { itemClientSchema, itemUpdateSchema } from './item.validation';

const router = Router();

// Public routes (no auth required)
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

// User protected routes (sanitize + validate before controller)
router.post('/add',
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'image']),
  validate(itemClientSchema),
  itemController.createItem
);

router.patch('/:id',
  sanitizeBody(['title', 'shortDescription', 'description', 'category', 'image']),
  validate(itemUpdateSchema),
  itemController.updateItem
);

router.delete('/:id', itemController.deleteItem);
router.get('/manage', itemController.getUserItems);

export default router;
