import type { Request, Response, NextFunction } from 'express';
import { itemService } from './item.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { itemCreateFullSchema, itemUpdateValidationSchema } from './item.validation';

export const itemController = {
  getAllItems: catchAsync(async (req: Request, res: Response) => {
    const items = await itemService.getAllItems(req.query as Record<string, unknown>);
    sendResponse(res, 200, {
      success: true,
      message: 'Items retrieved successfully',
      data: items,
      meta: null,
    });
  }),

  getItemById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const item = await itemService.getItemById(id as string);
    if (!item) {
      sendResponse(res, 404, {
        success: false,
        message: 'Item not found',
        data: null,
        meta: null,
      });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Item retrieved successfully',
      data: item,
      meta: null,
    });
  }),

  createItem: catchAsync(async (req: Request, res: Response) => {
    const validatedData = itemCreateFullSchema.parse(req.body);
    const item = await itemService.createItem(validatedData);
    sendResponse(res, 201, {
      success: true,
      message: 'Item created successfully',
      data: item,
      meta: null,
    });
  }),

  updateItem: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validatedData = itemUpdateValidationSchema.parse(req.body);
    const item = await itemService.updateItem(id as string, validatedData);
    if (!item) {
      sendResponse(res, 404, {
        success: false,
        message: 'Item not found',
        data: null,
        meta: null,
      });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Item updated successfully',
      data: item,
      meta: null,
    });
  }),

  deleteItem: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await itemService.deleteItem(id as string);
    sendResponse(res, 200, {
      success: true,
      message: 'Item deleted successfully',
      data: null,
      meta: null,
    });
  }),

  getUserItems: catchAsync(async (_req: Request, res: Response) => {
    const userId = 'system'; // Will be replaced by auth middleware
    const items = await itemService.getUserItems(userId);
    sendResponse(res, 200, {
      success: true,
      message: 'User items retrieved successfully',
      data: items,
      meta: null,
    });
  }),
};
