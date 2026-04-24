import type { Request, Response } from 'express';
import { CourseModuleService } from './coursemodule.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import {
  batchLinkBodySchema,
  batchLinkSchema,
  batchUnlinkBodySchema,
  createCourseModuleSchema,
  linkModuleBodySchema,
} from './coursemodule.validation';

export const CourseModuleController = {
  linkModule: catchAsync(async (req: Request, res: Response) => {
    const validatedData = createCourseModuleSchema.parse(req.body);
    const result = await CourseModuleService.linkModuleToCourse(validatedData);
    sendResponse(res, 201, {
      success: true,
      message: 'Module linked to course successfully',
      data: result,
      meta: null,
    });
  }),

  linkCourseModules: catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;

    if (Array.isArray(req.body?.modules)) {
      const validatedData = batchLinkBodySchema.parse(req.body);
      await CourseModuleService.batchLinkModules({
        courseId,
        modules: validatedData.modules,
      });

      sendResponse(res, 201, {
        success: true,
        message: 'Modules linked to course successfully',
        data: null,
        meta: null,
      });
      return;
    }

    const validatedData = linkModuleBodySchema.parse(req.body);
    const result = await CourseModuleService.linkModuleToCourse({
      courseId,
      moduleId: validatedData.moduleId,
      order: validatedData.order,
    });

    sendResponse(res, 201, {
      success: true,
      message: 'Module linked to course successfully',
      data: result,
      meta: null,
    });
  }),

  unlinkModule: catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const moduleId = req.params.moduleId as string;
    await CourseModuleService.unlinkModuleFromCourse(courseId, moduleId);
    sendResponse(res, 200, {
      success: true,
      message: 'Module unlinked from course successfully',
      data: null,
      meta: null,
    });
  }),

  unlinkCourseModules: catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const { moduleIds } = batchUnlinkBodySchema.parse(req.body);
    await CourseModuleService.batchUnlinkModules(courseId, moduleIds);
    sendResponse(res, 200, {
      success: true,
      message: 'Modules unlinked from course successfully',
      data: null,
      meta: null,
    });
  }),

  getCourseModules: catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const modules = await CourseModuleService.getModulesByCourse(courseId);
    sendResponse(res, 200, {
      success: true,
      message: 'Course modules retrieved successfully',
      data: modules,
      meta: null,
    });
  }),

  getModuleCourses: catchAsync(async (req: Request, res: Response) => {
    const moduleId = req.params.moduleId as string;
    const courses = await CourseModuleService.getCoursesByModule(moduleId);
    sendResponse(res, 200, {
      success: true,
      message: 'Module courses retrieved successfully',
      data: courses,
      meta: null,
    });
  }),

  batchLinkModules: catchAsync(async (req: Request, res: Response) => {
    const validatedData = batchLinkSchema.parse(req.body);
    await CourseModuleService.batchLinkModules(validatedData);
    sendResponse(res, 201, {
      success: true,
      message: 'Modules linked to course successfully',
      data: null,
      meta: null,
    });
  }),

  batchUnlinkModules: catchAsync(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const { moduleIds } = batchUnlinkBodySchema.parse(req.body);
    await CourseModuleService.batchUnlinkModules(courseId, moduleIds);
    sendResponse(res, 200, {
      success: true,
      message: 'Modules unlinked from course successfully',
      data: null,
      meta: null,
    });
  }),
};
