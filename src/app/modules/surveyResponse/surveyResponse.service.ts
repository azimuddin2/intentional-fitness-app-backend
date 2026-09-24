import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TAnswer } from './surveyResponse.interface';
import { SurveyResponse } from './surveyResponse.model';
import { SurveyQuestion } from '../surveyQuestion/surveyQuestion.model';
import { User } from '../user/user.model';

const submitSurveyResponseIntoDB = async (
  userId: string,
  payload: { survey: string; answers: TAnswer[] },
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (!user.trainer) {
    throw new AppError(400, 'No trainer assigned to this user');
  }

  // 🔹 Duplicate submission check
  const existingResponse = await SurveyResponse.findOne({
    survey: payload.survey,
    user: userId,
  });

  if (existingResponse) {
    throw new AppError(400, 'You have already submitted this survey');
  }

  // Check if all required questions have been answered
  const requiredQuestions = await SurveyQuestion.find({
    survey: payload.survey,
    isRequired: true,
  });

  const answeredQuestionIds = payload.answers.map((a) => a.question.toString());

  const missingQuestions = requiredQuestions.filter(
    (q) => !answeredQuestionIds.includes((q._id as string).toString()),
  );

  if (missingQuestions.length > 0) {
    throw new AppError(
      400,
      'Please answer all required questions before submitting',
    );
  }

  const result = await SurveyResponse.create({
    survey: payload.survey,
    user: userId,
    trainer: user.trainer,
    status: 'completed',
    answers: payload.answers,
    completedAt: new Date().toISOString(),
  });

  if (!result) {
    throw new AppError(400, 'Failed to submit survey response');
  }

  return result;
};

const getMyResponsesFromDB = async (userId: string) => {
  const result = await SurveyResponse.find({ user: userId })
    .populate('user', 'name email')
    .populate('survey', 'title description')
    .populate('answers.question', 'questionText questionType options -_id')
    .sort({ createdAt: -1 });

  return result;
};

const getAllResponsesFromDB = async (query: Record<string, unknown>) => {
  const responseQuery = new QueryBuilder(
    SurveyResponse.find()
      .populate('user', 'name email')
      .populate('survey', 'title'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await responseQuery.countTotal();
  const result = await responseQuery.modelQuery;

  return { meta, result };
};

const getResponsesByUserFromDB = async (trainerId: string, userId: string) => {
  const user = await User.findOne({
    _id: userId,
    trainer: trainerId,
  });

  if (!user) {
    throw new AppError(403, 'This user is not assigned to you');
  }

  const result = await SurveyResponse.find({ user: userId })
    .select('-answers -createdAt -updatedAt -__v')
    .populate('survey', 'title', '')
    .sort({ createdAt: -1 });

  return result;
};

const getSingleResponseFromDB = async (id: string) => {
  const result = await SurveyResponse.findById(id)
    .populate('user', 'name email')
    .populate('survey', 'title description')
    .populate('answers.question', 'questionText questionType options -_id');

  if (!result) {
    throw new AppError(404, 'Response not found');
  }

  return result;
};

export const SurveyResponseServices = {
  submitSurveyResponseIntoDB,
  getMyResponsesFromDB,
  getAllResponsesFromDB,
  getResponsesByUserFromDB,
  getSingleResponseFromDB,
};
