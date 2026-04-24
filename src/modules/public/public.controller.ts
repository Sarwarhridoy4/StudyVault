import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { PublicService } from './public.service';

export const PublicController = {
  getLandingPage: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, 200, {
      success: true,
      message: 'Welcome to StudyVault',
      data: PublicService.getLandingPageData(),
      meta: null,
    });
  }),

  getAboutPage: catchAsync(async (_req: Request, res: Response) => {
    sendResponse(res, 200, {
      success: true,
      message: 'About StudyVault',
      data: PublicService.getAboutPageData(),
      meta: null,
    });
  }),
};
