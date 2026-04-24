import type { Request, Response, NextFunction } from 'express';
import { moduleService } from './module.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { validate } from '../../middlewares/validation';
import { sanitizeBody } from '../../middlewares/sanitize';
import { moduleClientSchema, moduleUpdateSchema } from './module.validation';

export const moduleController = {
  getAllModules: catchAsync(async (req: Request, res: Response) => {
    const modules = await moduleService.getAllModules(req.query as Record<string, unknown>);
    sendResponse(res, 200, {
      success: true,
      message: 'Modules retrieved successfully',
      data: modules,
      meta: null,
    });
  }),

  getModuleById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const module = await moduleService.getModuleById(id as string);
    sendResponse(res, 200, {
      success: true,
      message: 'Module retrieved successfully',
      data: module,
      meta: null,
    });
  }),

  createModule: catchAsync(async (req: Request, res: Response) => {
    // Validation already done by middleware, data is safe
    const validatedData = {
      ...req.body,
      createdBy: 'system', // Will be replaced by auth middleware
    } as any;
    const module = await moduleService.createModule(validatedData);
    sendResponse(res, 201, {
      success: true,
      message: 'Module created successfully',
      data: module,
      meta: null,
    });
  }),

  updateModule: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const validatedData = req.body;
    const module = await moduleService.updateModule(id as string, validatedData);
    sendResponse(res, 200, {
      success: true,
      message: 'Module updated successfully',
      data: module,
      meta: null,
    });
  }),

  deleteModule: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await moduleService.deleteModule(id as string);
    sendResponse(res, 200, {
      success: true,
      message: 'Module deleted successfully',
      data: null,
      meta: null,
    });
  }),

  getUserModules: catchAsync(async (_req: Request, res: Response) => {
    const userId = 'system'; // Will be replaced by auth middleware
    const modules = await moduleService.getUserModules(userId);
    sendResponse(res, 200, {
      success: true,
      message: 'User modules retrieved successfully',
      data: modules,
      meta: null,
    });
  }),
};
