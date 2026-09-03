import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCheckIn } from './checkIn.interface';
import { CheckIn } from './checkIn.model';
import { Metric } from '../metrics/metrics.model';

const createCheckInIntoDB = async (userId: string, payload: TCheckIn) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (
    !payload.metric ||
    !mongoose.Types.ObjectId.isValid(payload.metric.toString())
  ) {
    throw new AppError(400, 'Invalid metric ID');
  }

  // Check metric exists and belongs to this user
  const metric = await Metric.findOne({
    _id: payload.metric,
    user: userId,
    isActive: true,
  });

  if (!metric) {
    throw new AppError(404, 'Metric not found for this user');
  }

  // Determine proof type automatically
  let proofType: 'text' | 'photo' | undefined;

  if (payload.note) {
    proofType = 'text';
  } else if (payload.photo) {
    proofType = 'photo';
  }

  const result = await CheckIn.create({
    ...payload,
    user: userId,
    proofType,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create check-in');
  }

  return result;
};

const getMyCheckInsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const checkInQuery = new QueryBuilder(
    CheckIn.find({
      user: userId,
    }).populate('metric'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await checkInQuery.countTotal();
  const result = await checkInQuery.modelQuery;

  return { meta, result };
};

const getCheckInsByMetricFromDB = async (
  userId: string,
  metricId: string,
  query: Record<string, unknown>,
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (!mongoose.Types.ObjectId.isValid(metricId)) {
    throw new AppError(400, 'Invalid metric ID');
  }

  // Make sure this metric belongs to the user
  const metric = await Metric.findOne({
    _id: metricId,
    user: userId,
  });

  if (!metric) {
    throw new AppError(404, 'Metric not found for this user');
  }

  const checkInQuery = new QueryBuilder(
    CheckIn.find({
      user: userId,
      metric: metricId,
    }).populate('metric'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await checkInQuery.countTotal();
  const result = await checkInQuery.modelQuery;

  return { meta, result };
};

const getCheckInByIdFromDB = async (userId: string, id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid check-in ID');
  }

  const result = await CheckIn.findOne({
    _id: id,
    user: userId,
  }).populate('metric');

  if (!result) {
    throw new AppError(404, 'Check-in not found');
  }

  return result;
};

const updateCheckInIntoDB = async (
  userId: string,
  id: string,
  payload: Partial<TCheckIn>,
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid check-in ID');
  }

  const isCheckInExists = await CheckIn.findOne({
    _id: id,
    user: userId,
  });

  if (!isCheckInExists) {
    throw new AppError(404, 'Check-in does not exist');
  }

  // Determine proof type automatically
  let proofType = isCheckInExists.proofType;

  if (payload.note) {
    proofType = 'text';
  } else if (payload.photo) {
    proofType = 'photo';
  }

  const updatedCheckIn = await CheckIn.findOneAndUpdate(
    {
      _id: id,
      user: userId,
    },
    {
      ...payload,
      proofType,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedCheckIn) {
    throw new AppError(400, 'Check-in update failed');
  }

  return updatedCheckIn;
};

const deleteCheckInFromDB = async (userId: string, id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid check-in ID');
  }

  const isCheckInExists = await CheckIn.findOne({
    _id: id,
    user: userId,
  });

  if (!isCheckInExists) {
    throw new AppError(404, 'Check-in not found');
  }

  const result = await CheckIn.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!result) {
    throw new AppError(400, 'Failed to delete check-in');
  }

  return result;
};

export const CheckInServices = {
  createCheckInIntoDB,
  getMyCheckInsFromDB,
  getCheckInsByMetricFromDB,
  getCheckInByIdFromDB,
  updateCheckInIntoDB,
  deleteCheckInFromDB,
};
