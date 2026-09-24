import AppError from '../../errors/AppError';
import { Survey } from '../survey/survey.modal';
import { TSurveyQuestion } from './surveyQuestion.interface';
import { SurveyQuestion } from './surveyQuestion.model';

const createSurveyQuestionIntoDB = async (payload: TSurveyQuestion) => {
  const lastQuestion = await SurveyQuestion.findOne({
    survey: payload.survey,
  }).sort({ orderIndex: -1 });

  const nextOrderIndex = lastQuestion ? (lastQuestion.orderIndex ?? 0) + 1 : 1;

  const result = await SurveyQuestion.create({
    ...payload,
    orderIndex: nextOrderIndex,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create question');
  }

  return result;
};

const getQuestionsBySurveyFromDB = async (surveyId: string) => {
  const result = await SurveyQuestion.find({ survey: surveyId }).sort({
    orderIndex: 1,
  });

  const survey = await Survey.findById(surveyId);

  return { survey, result };
};

const getQuestionByIdFromDB = async (id: string) => {
  const result = await SurveyQuestion.findById(id);

  if (!result) {
    throw new AppError(404, 'Question not found');
  }

  return result;
};

const updateSurveyQuestionIntoDB = async (
  id: string,
  payload: Partial<TSurveyQuestion>,
) => {
  const isQuestionExists = await SurveyQuestion.findById(id);

  if (!isQuestionExists) {
    throw new AppError(404, 'Question does not exist');
  }

  const updatedQuestion = await SurveyQuestion.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedQuestion) {
    throw new AppError(400, 'Question update failed');
  }

  return updatedQuestion;
};

const deleteSurveyQuestionFromDB = async (id: string) => {
  const isQuestionExists = await SurveyQuestion.findById(id);

  if (!isQuestionExists) {
    throw new AppError(404, 'Question not found');
  }

  const result = await SurveyQuestion.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Failed to delete question');
  }

  return result;
};

export const SurveyQuestionServices = {
  createSurveyQuestionIntoDB,
  getQuestionsBySurveyFromDB,
  getQuestionByIdFromDB,
  updateSurveyQuestionIntoDB,
  deleteSurveyQuestionFromDB,
};
