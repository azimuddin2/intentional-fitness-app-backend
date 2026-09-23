import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SurveyServices } from './survey.service';

const createSurvey = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user.userId;
  const result = await SurveyServices.createSurveyIntoDB(adminId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Survey created successfully',
    data: result,
  });
});

const getAllSurveys = catchAsync(async (req: Request, res: Response) => {
  const result = await SurveyServices.getAllSurveysFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Surveys retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getActiveSurveys = catchAsync(async (req: Request, res: Response) => {
  const result = await SurveyServices.getActiveSurveysFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Surveys retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSurveyById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SurveyServices.getSurveyByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Survey retrieved successfully',
    data: result,
  });
});

const updateSurvey = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SurveyServices.updateSurveyIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Survey updated successfully',
    data: result,
  });
});

const changeSurveyStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await SurveyServices.changeSurveyStatusIntoDB(id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Survey status updated successfully',
    data: result,
  });
});

export const SurveyControllers = {
  createSurvey,
  getAllSurveys,
  getActiveSurveys,
  getSurveyById,
  updateSurvey,
  changeSurveyStatus,
};
