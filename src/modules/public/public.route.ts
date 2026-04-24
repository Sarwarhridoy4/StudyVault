import { Router } from 'express';
import { PublicController } from './public.controller';

const router = Router();

router.get('/', PublicController.getLandingPage);
router.get('/about', PublicController.getAboutPage);

export default router;
