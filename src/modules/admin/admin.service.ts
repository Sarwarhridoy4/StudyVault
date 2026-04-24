import { CourseService } from '../course/course.service';
import { moduleService } from '../module/module.service';
import { UserService } from '../user/user.service';

export const AdminService = {
  getAllModules: async (query: Record<string, unknown>) => {
    return moduleService.getAllModules(query);
  },

  updateModule: async (id: string, payload: Record<string, unknown>) => {
    return moduleService.updateModule(id, payload);
  },

  deleteModule: async (id: string) => {
    return moduleService.deleteModule(id);
  },

  getAllCourses: async () => {
    return CourseService.getAllCourses();
  },

  getAllUsers: async () => {
    return UserService.getAllUsers();
  },
};
