import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TSurvey, TSurveyStatus } from './survey.interface';
import { Survey } from './survey.modal';

const createSurveyIntoDB = async (adminId: string, payload: TSurvey) => {
  const lastSurvey = await Survey.findOne().sort({ orderIndex: -1 });
  const nextOrderIndex = lastSurvey ? (lastSurvey.orderIndex ?? 0) + 1 : 1;

  const result = await Survey.create({
    ...payload,
    createdBy: adminId,
    orderIndex: nextOrderIndex,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create survey');
  }

  return result;
};

const getAllSurveysFromDB = async (query: Record<string, unknown>) => {
  const surveyQuery = new QueryBuilder(
    Survey.find().sort({ orderIndex: 1 }),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await surveyQuery.countTotal();
  const result = await surveyQuery.modelQuery;

  return { meta, result };
};

const getActiveSurveysFromDB = async (query: Record<string, unknown>) => {
  const surveyQuery = new QueryBuilder(
    Survey.find({ status: 'active' }).sort({ orderIndex: 1 }),
    query,
  )
    .search(['title'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await surveyQuery.countTotal();
  const result = await surveyQuery.modelQuery;

  return { meta, result };
};

const getSurveyByIdFromDB = async (id: string) => {
  const result = await Survey.findById(id);

  if (!result) {
    throw new AppError(404, 'Survey not found');
  }

  return result;
};

const updateSurveyIntoDB = async (id: string, payload: Partial<TSurvey>) => {
  const isSurveyExists = await Survey.findById(id);

  if (!isSurveyExists) {
    throw new AppError(404, 'Survey does not exist');
  }

  const updatedSurvey = await Survey.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedSurvey) {
    throw new AppError(400, 'Survey update failed');
  }

  return updatedSurvey;
};

const changeSurveyStatusIntoDB = async (id: string, status: TSurveyStatus) => {
  const isSurveyExists = await Survey.findById(id);

  if (!isSurveyExists) {
    throw new AppError(404, 'Survey not found');
  }

  const result = await Survey.findByIdAndUpdate(id, { status }, { new: true });

  if (!result) {
    throw new AppError(400, 'Failed to update survey status');
  }

  return result;
};

export const SurveyServices = {
  createSurveyIntoDB,
  getAllSurveysFromDB,
  getActiveSurveysFromDB,
  getSurveyByIdFromDB,
  updateSurveyIntoDB,
  changeSurveyStatusIntoDB,
};
