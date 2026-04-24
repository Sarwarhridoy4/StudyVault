import { Router } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import Course from '../course/course.model';
import Module from '../module/module.model';
import CourseModule from '../coursemodule/coursemodule.model';
import type { ICourse } from '../course/course.model';
import type { IModule } from '../module/module.model';
import { CourseService } from '../course/course.service';
import { CourseModuleService } from '../coursemodule/coursemodule.service';
import { moduleService } from '../module/module.service';

const router = Router();

// Admin: Get all modules (global control) with filtering
router.get(
  '/modules',
  catchAsync(async (req, res) => {
    const modules = await moduleService.getAllModules(req.query as Record<string, unknown>);
    return sendResponse(res, 200, {
      success: true,
      message: 'All modules retrieved',
      data: { modules },
      meta: null,
    });
  })
);

// Admin: Delete any module
router.delete(
  '/modules/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await moduleService.deleteModule(id as string);
    return sendResponse(res, 200, {
      success: true,
      message: 'Module deleted successfully',
      data: null,
      meta: null,
    });
  })
);

// Admin: Edit any module
router.patch(
  '/modules/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const module = await moduleService.updateModule(id as string, req.body);
    return sendResponse(res, 200, {
      success: true,
      message: 'Module updated successfully',
      data: { module },
      meta: null,
    });
  })
);

// Admin: Get all courses
router.get(
  '/courses',
  catchAsync(async (_req, res) => {
    const courses = await CourseService.getAllCourses();
    return sendResponse(res, 200, {
      success: true,
      message: 'All courses retrieved',
      data: { courses },
      meta: null,
    });
  })
);

// Admin: Get all users
router.get(
  '/users',
  catchAsync(async (_req, res) => {
    const User = (await import('../user/user.model')).default;
    const users = await User.find().select('-__v -password').lean();
    return sendResponse(res, 200, {
      success: true,
      message: 'All users retrieved',
      data: { users },
      meta: null,
    });
  })
);

// Admin: Link module to course
router.post(
  '/courses/:courseId/modules/:moduleId/link',
  catchAsync(async (req, res) => {
    const courseId = req.params.courseId as string;
    const moduleId = req.params.moduleId as string;
    const order = req.body.order || 0;
    const result = await CourseModuleService.linkModuleToCourse({ courseId, moduleId, order });
    return sendResponse(res, 201, {
      success: true,
      message: 'Module linked to course successfully',
      data: result,
      meta: null,
    });
  })
);

// Admin: Unlink module from course
router.delete(
  '/courses/:courseId/modules/:moduleId/unlink',
  catchAsync(async (req, res) => {
    const courseId = req.params.courseId as string;
    const moduleId = req.params.moduleId as string;
    await CourseModuleService.unlinkModuleFromCourse(courseId, moduleId);
    return sendResponse(res, 200, {
      success: true,
      message: 'Module unlinked from course successfully',
      data: null,
      meta: null,
    });
  })
);

// Admin: Get modules for a course
router.get(
  '/courses/:courseId/modules',
  catchAsync(async (req, res) => {
    const courseId = req.params.courseId as string;
    const modules = await CourseModuleService.getModulesByCourse(courseId);
    return sendResponse(res, 200, {
      success: true,
      message: 'Course modules retrieved',
      data: { modules },
      meta: null,
    });
  })
);

// Admin: Batch link modules to course
router.post(
  '/courses/:courseId/modules/batch/link',
  catchAsync(async (req, res) => {
    const courseId = req.params.courseId as string;
    const modules = req.body.modules;
    if (!modules || !Array.isArray(modules)) {
      return sendResponse(res, 400, {
        success: false,
        message: 'Modules array is required',
        data: null,
        meta: null,
      });
    }
    await CourseModuleService.batchLinkModules({ courseId, modules });
    return sendResponse(res, 201, {
      success: true,
      message: 'Modules linked to course successfully',
      data: null,
      meta: null,
    });
  })
);

// Admin: Batch unlink modules from course
router.delete(
  '/courses/:courseId/modules/batch/unlink',
  catchAsync(async (req, res) => {
    const courseId = req.params.courseId as string;
    const moduleIds = req.body.moduleIds;
    if (!moduleIds || !Array.isArray(moduleIds)) {
      return sendResponse(res, 400, {
        success: false,
        message: 'moduleIds array is required',
        data: null,
        meta: null,
      });
    }
    await CourseModuleService.batchUnlinkModules(courseId, moduleIds);
    return sendResponse(res, 200, {
      success: true,
      message: 'Modules unlinked from course successfully',
      data: null,
      meta: null,
    });
  })
);

export default router;
