import type { Request, Response, NextFunction } from 'express';
import { StudyService } from './study.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { createStudySchema, updateStudySchema } from './study.validation';

export const StudyController = {
  createStudy: catchAsync(async (req: Request, res: Response) => {
    const validatedData = createStudySchema.parse(req.body);
    const result = await StudyService.createStudy(validatedData);
    sendResponse(res, 201, {
      success: true,
      message: 'Study created successfully',
      data: result,
      meta: null,
    });
  }),

  getStudyById: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await StudyService.getStudyById(id);
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Study not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Study retrieved successfully',
      data: result,
      meta: null,
    });
  }),

  getAllStudies: catchAsync(async (_req: Request, res: Response) => {
    const result = await StudyService.getAllStudies();
    sendResponse(res, 200, {
      success: true,
      message: 'Studies retrieved successfully',
      data: result,
      meta: null,
    });
  }),

  updateStudy: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const validatedData = updateStudySchema.parse(req.body);
    const result = await StudyService.updateStudy(id, validatedData);
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Study not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Study updated successfully',
      data: result,
      meta: null,
    });
  }),

  deleteStudy: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await StudyService.deleteStudy(id);
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Study not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Study deleted successfully',
      data: result,
      meta: null,
    });
  }),
};
