import { Router } from 'express';
import { itemController } from './item.controller';

const router = Router();

// Public routes (no auth required)
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);

// User protected routes (auth will be added later)
router.post('/add', itemController.createItem);
router.patch('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);
router.get('/manage', itemController.getUserItems);

export default router;
