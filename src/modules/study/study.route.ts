import { Router } from 'express';
import { StudyController } from './study.controller';
import auth from '../../middlewares/auth';
import rbac from '../../middlewares/rbac';

const router = Router();

// Public routes
router.get('/', StudyController.getAllStudies);
router.get('/:id', StudyController.getStudyById);

// Protected routes
router.post('/', auth, rbac, StudyController.createStudy);
router.patch('/:id', auth, rbac, StudyController.updateStudy);
router.delete('/:id', auth, rbac, StudyController.deleteStudy);

export default router;
