import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import Item from '../item/item.model';
import User from '../user/user.model';
import type { IItem } from '../item/item.model';
import type { IUser } from '../user/user.model';

const router = Router();

// Admin: Get all items (global control)
router.get(
  '/items',
  catchAsync(async (_req, res) => {
    // TODO: Add admin authorization middleware
    const items = await Item.find().lean<IItem[]>();
    return sendResponse(res, 200, {
      success: true,
      message: 'All items retrieved',
      data: { items },
      meta: null,
    });
  })
);

// Admin: Delete any item
router.delete(
  '/items/:id',
  catchAsync(async (req, res) => {
    // TODO: Add admin authorization middleware
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    return sendResponse(res, 200, {
      success: true,
      message: 'Item deleted successfully',
      data: null,
      meta: null,
    });
  })
);

// Admin: Edit any item
router.patch(
  '/items/:id',
  catchAsync(async (req, res) => {
    // TODO: Add admin authorization middleware
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    return sendResponse(res, 200, {
      success: true,
      message: 'Item updated successfully',
      data: { item },
      meta: null,
    });
  })
);

// Admin: Get all users
router.get(
  '/users',
  catchAsync(async (_req, res) => {
    // TODO: Add admin authorization middleware
    const users = await User.find().select('-__v').lean<IUser[]>();
    return sendResponse(res, 200, {
      success: true,
      message: 'All users retrieved',
      data: { users },
      meta: null,
    });
  })
);

export default router;
