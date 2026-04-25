import type { Request, Response, NextFunction } from 'express';
import { CourseService } from './course.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { createCourseSchema, updateCourseSchema } from './course.validation';

export const CourseController = {
  createCourse: catchAsync(async (req: Request, res: Response) => {
    const validatedData = createCourseSchema.parse(req.body);

    // Enforce image requirement
    if (!validatedData.image && !req.file) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Image is required: provide an image URL in the "image" field or upload an image file',
        data: null,
        meta: null,
      });
    }

    // Set creator from authenticated user (not from client)
    // @ts-ignore - req.user set by auth middleware
    const createdBy = req.user.uid;

    const result = await CourseService.createCourse({
      ...validatedData,
      createdBy,
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

  // Link a module to a course (push module ObjectId into modules array)
  linkModule: catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const { moduleId } = req.body;

    const result = await CourseService.addModuleToCourse(courseId, moduleId);
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Course not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Module linked to course successfully',
      data: result,
      meta: null,
    });
  }),

  // Unlink a module from a course (remove module ObjectId from modules array)
  unlinkModule: catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const moduleId = req.params.moduleId as string;

    const result = await CourseService.removeModuleFromCourse(courseId, moduleId);
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Course not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Module unlinked from course successfully',
      data: result,
      meta: null,
    });
  }),

  // Get all modules linked to a course
  getCourseModules: catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const result = await CourseService.getCourseModules(courseId);
    if (!result) {
      sendResponse(res, 404, { success: false, message: 'Course not found', data: null, meta: null });
      return;
    }
    sendResponse(res, 200, {
      success: true,
      message: 'Course modules retrieved successfully',
      data: result,
      meta: null,
    });
  }),
};
