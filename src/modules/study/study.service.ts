import { StudyRepository } from './study.repository';
import type { CreateStudyInput, UpdateStudyInput } from './study.validation';
import type { IStudy } from './study.model';

export const StudyService = {
  createStudy: async (data: CreateStudyInput): Promise<IStudy> => {
    return await StudyRepository.create(data);
  },

  getStudyById: async (id: string): Promise<IStudy | null> => {
    return await StudyRepository.findById(id);
  },

  getAllStudies: async (queryStr: Record<string, unknown> = {}): Promise<IStudy[]> => {
    return await StudyRepository.findAll(queryStr);
  },

  updateStudy: async (id: string, data: UpdateStudyInput): Promise<IStudy | null> => {
    return await StudyRepository.updateById(id, data);
  },

  deleteStudy: async (id: string): Promise<IStudy | null> => {
    return await StudyRepository.deleteById(id);
  },

  countStudies: async (filter = {}): Promise<number> => {
    return await StudyRepository.count(filter);
  },
};
