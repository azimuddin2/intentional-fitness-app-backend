import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TCheckIn } from './checkIn.interface';
import { CheckIn } from './checkIn.model';
import { Metric } from '../metrics/metrics.model';
import { getDayBoundary } from './checkIn.utils';
import { uploadToS3 } from '../../utils/awsS3FileUploader';

const createCheckInIntoDB = async (
  userId: string,
  payload: TCheckIn,
  file?: Express.Multer.File,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  if (
    !payload.metric ||
    !mongoose.Types.ObjectId.isValid(payload.metric.toString())
  ) {
    throw new AppError(400, 'Invalid metric ID');
  }

  if (!payload.note?.trim() && !file) {
    throw new AppError(400, 'Either note or photo is required for check-in');
  }

  const metric = await Metric.findOne({
    _id: payload.metric,
    user: userId,
    isActive: true,
  });

  if (!metric) {
    throw new AppError(404, 'Metric not found for this user');
  }

  const { startOfDay, endOfDay } = getDayBoundary();

  const existingCheckIn = await CheckIn.findOne({
    user: userId,
    metric: payload.metric,
    checkInDate: { $gte: startOfDay, $lte: endOfDay },
  });

  if (existingCheckIn) {
    throw new AppError(400, 'Already checked in today for this metric');
  }

  let photoUrl: string | undefined;

  if (file) {
    const uploadResult = await uploadToS3({
      file,
      fileName: `images/check-in/${Date.now()}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`,
    });

    if (!uploadResult) {
      throw new AppError(500, 'Failed to upload photo. Please try again.');
    }

    photoUrl = uploadResult;
  }

  let proofType: 'text' | 'photo' | undefined;
  if (photoUrl) {
    proofType = 'photo';
  } else if (payload.note) {
    proofType = 'text';
  }

  const result = await CheckIn.create({
    ...payload,
    user: userId,
    photo: photoUrl,
    proofType,
    checkInDate: new Date(),
  });

  if (!result) {
    throw new AppError(400, 'Failed to create check-in');
  }

  return result;
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
    }),
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

const getCheckInsByUserFromDB = async (
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
    }),
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

export const CheckInServices = {
  createCheckInIntoDB,
  getCheckInsByMetricFromDB,
  getCheckInsByUserFromDB,
};
