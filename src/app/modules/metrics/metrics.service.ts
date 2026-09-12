import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import mongoose from 'mongoose';
import { TMetric } from './metrics.interface';
import { Metric } from './metrics.model';
import { User } from '../user/user.model';

const createMetricIntoDB = async (
  trainerId: string,
  userId: string,
  payload: TMetric,
) => {
  if (!mongoose.Types.ObjectId.isValid(trainerId)) {
    throw new AppError(400, 'Invalid trainer ID');
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new AppError(404, 'User not found');
  }

  const result = await Metric.create({
    ...payload,
    trainer: trainerId,
    user: userExists._id,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create metric');
  }

  return result;
};

const getMyMetricsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const metricQuery = new QueryBuilder(
    Metric.find({
      user: userId,
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await metricQuery.countTotal();
  const result = await metricQuery.modelQuery;

  return { meta, result };
};

const getMetricsByUserFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const metricQuery = new QueryBuilder(
    Metric.find({
      user: userId,
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await metricQuery.countTotal();
  const result = await metricQuery.modelQuery;

  return { meta, result };
};

const getMetricByIdFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid metric ID');
  }

  const result = await Metric.findById(id);

  if (!result) {
    throw new AppError(404, 'Metric not found');
  }

  return result;
};

const updateMetricIntoDB = async (id: string, payload: Partial<TMetric>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid metric ID');
  }

  const isMetricExists = await Metric.findById(id);

  if (!isMetricExists) {
    throw new AppError(404, 'Metric does not exist');
  }

  const updatedMetric = await Metric.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedMetric) {
    throw new AppError(400, 'Metric update failed');
  }

  return updatedMetric;
};

const deleteMetricFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid metric ID');
  }

  const isMetricExists = await Metric.findById(id);

  if (!isMetricExists) {
    throw new AppError(404, 'Metric not found');
  }

  const result = await Metric.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Failed to delete metric');
  }

  return result;
};

export const MetricServices = {
  createMetricIntoDB,
  getMyMetricsFromDB,
  getMetricByIdFromDB,
  getMetricsByUserFromDB,
  updateMetricIntoDB,
  deleteMetricFromDB,
};
