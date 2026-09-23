import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SurveyQuestionServices } from './surveyQuestion.service';

const createSurveyQuestion = catchAsync(async (req: Request, res: Response) => {
  const result = await SurveyQuestionServices.createSurveyQuestionIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Question created successfully',
    data: result,
  });
});

const getQuestionsBySurvey = catchAsync(async (req: Request, res: Response) => {
  const { surveyId } = req.params;
  const result =
    await SurveyQuestionServices.getQuestionsBySurveyFromDB(surveyId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Questions retrieved successfully',
    data: result,
  });
});

const getQuestionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SurveyQuestionServices.getQuestionByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Question retrieved successfully',
    data: result,
  });
});

const updateSurveyQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SurveyQuestionServices.updateSurveyQuestionIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Question updated successfully',
    data: result,
  });
});

const deleteSurveyQuestion = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SurveyQuestionServices.deleteSurveyQuestionFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Question deleted successfully',
    data: result,
  });
});

export const SurveyQuestionControllers = {
  createSurveyQuestion,
  getQuestionsBySurvey,
  getQuestionById,
  updateSurveyQuestion,
  deleteSurveyQuestion,
};
