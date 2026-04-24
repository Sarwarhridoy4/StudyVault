import type { Request, Response, NextFunction } from 'express';
import { CourseService } from './course.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { createCourseSchema, updateCourseSchema } from './course.validation';

export const CourseController = {
  createCourse: catchAsync(async (req: Request, res: Response) => {
    const validatedData = createCourseSchema.parse(req.body);
    const result = await CourseService.createCourse({
      ...validatedData,
      imageFile: (req.file as Express.Multer.File)?.buffer,
    });
    sendResponse(res, 201, {
      success: true,
      message: 'Course created successfully',
      data: result,
      meta: null,
    });
  }),

  getCourseById: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await CourseService.getCourseById(id);
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Course not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Course retrieved successfully',
      data: result,
      meta: null,
    });
  }),

  getAllCourses: catchAsync(async (req: Request, res: Response) => {
    const result = await CourseService.getAllCourses(req.query as Record<string, unknown>);
    sendResponse(res, 200, {
      success: true,
      message: 'Courses retrieved successfully',
      data: result,
      meta: null,
    });
  }),

  updateCourse: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const validatedData = updateCourseSchema.parse(req.body);
    const result = await CourseService.updateCourse(id, {
      ...validatedData,
      imageFile: (req.file as Express.Multer.File)?.buffer,
    });
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Course not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Course updated successfully',
      data: result,
      meta: null,
    });
  }),

  deleteCourse: catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await CourseService.deleteCourse(id);
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Course not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Course deleted successfully',
      data: result,
      meta: null,
    });
  }),
};
