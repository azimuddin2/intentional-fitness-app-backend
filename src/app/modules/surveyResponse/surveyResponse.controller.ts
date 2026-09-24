import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SurveyResponseServices } from './surveyResponse.service';

const submitSurveyResponse = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await SurveyResponseServices.submitSurveyResponseIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Survey questions submitted successfully',
    data: result,
  });
});

const getMyResponses = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const result = await SurveyResponseServices.getMyResponsesFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My survey responses retrieved successfully',
    data: result,
  });
});

const getAllResponses = catchAsync(async (req: Request, res: Response) => {
  const result = await SurveyResponseServices.getAllResponsesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Survey responses retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getResponsesByUser = catchAsync(async (req: Request, res: Response) => {
  const trainerId = req.user.userId;
  const { userId } = req.params;

  const result = await SurveyResponseServices.getResponsesByUserFromDB(
    trainerId,
    userId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Survey responses retrieved successfully',
    data: result,
  });
});

const getSingleResponse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SurveyResponseServices.getSingleResponseFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Survey response retrieved successfully',
    data: result,
  });
});

export const SurveyResponseControllers = {
  submitSurveyResponse,
  getMyResponses,
  getAllResponses,
  getResponsesByUser,
  getSingleResponse,
};
