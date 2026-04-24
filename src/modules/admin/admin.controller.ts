import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AdminService } from './admin.service';

export const AdminController = {
  getAllModules: catchAsync(async (req: Request, res: Response) => {
    const modules = await AdminService.getAllModules(req.query as Record<string, unknown>);
    sendResponse(res, 200, {
      success: true,
      message: 'All modules retrieved',
      data: { modules },
      meta: null,
    });
  }),

  updateModule: catchAsync(async (req: Request, res: Response) => {
    const module = await AdminService.updateModule(req.params.id as string, req.body as Record<string, unknown>);
    sendResponse(res, 200, {
      success: true,
      message: 'Module updated successfully',
      data: { module },
      meta: null,
    });
  }),

  deleteModule: catchAsync(async (req: Request, res: Response) => {
    await AdminService.deleteModule(req.params.id as string);
    sendResponse(res, 200, {
      success: true,
      message: 'Module deleted successfully',
      data: null,
      meta: null,
    });
  }),

  getAllCourses: catchAsync(async (_req: Request, res: Response) => {
    const courses = await AdminService.getAllCourses();
    sendResponse(res, 200, {
      success: true,
      message: 'All courses retrieved',
      data: { courses },
      meta: null,
    });
  }),

  getAllUsers: catchAsync(async (_req: Request, res: Response) => {
    const users = await AdminService.getAllUsers();
    sendResponse(res, 200, {
      success: true,
      message: 'All users retrieved',
      data: { users },
      meta: null,
    });
  }),
};
