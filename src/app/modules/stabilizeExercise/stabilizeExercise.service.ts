import AppError from '../../errors/AppError';
import { UploadedFiles } from '../../interface/common.interface';
import { deleteFromS3, uploadManyToS3 } from '../../utils/awsS3FileUploader';
import { TStabilizeExercise } from './stabilizeExercise.interface';
import { StabilizeExercise } from './stabilizeExercise.model';

const createStabilizeExerciseIntoDB = async (
  trainerId: string,
  payload: TStabilizeExercise,
  files: any,
) => {
  if (!payload.isPublic && !payload.user) {
    throw new AppError(400, 'User is required when exercise is not public');
  }

  const isExerciseExists = await StabilizeExercise.findOne({
    name: payload.name,
    trainer: trainerId,
    user: payload.isPublic ? null : payload.user,
    category: payload.category,
    isDeleted: false,
  });

  if (isExerciseExists) {
    throw new AppError(400, 'This exercise already exists in this category');
  }

  // Handle single video upload to S3
  if (files) {
    const { video } = files as UploadedFiles;

    if (!video?.length) {
      throw new AppError(404, 'Exercise video is required');
    }

    if (video?.length) {
      const videoArray = [
        {
          file: video[0],
          path: `videos/exercise`,
        },
      ];

      try {
        const uploaded = await uploadManyToS3(videoArray);
        payload.video = uploaded[0]; // single video — take first element
      } catch (error) {
        throw new AppError(500, 'Video upload failed');
      }
    }
  } else {
    throw new AppError(404, 'Exercise video is required');
  }

  const result = await StabilizeExercise.create({
    ...payload,
    trainer: trainerId,
    user: payload.isPublic ? undefined : payload.user,
  });

  if (!result) {
    throw new AppError(400, 'Failed to create stabilize exercise');
  }

  return result;
};

const getStabilizeExercisesForClientFromDB = async (
  clientId: string,
  categoryId: string,
) => {
  const result = await StabilizeExercise.find({
    category: categoryId,
    isDeleted: false,
    $or: [{ user: clientId }, { isPublic: true }],
  })
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  return result;
};

const getStabilizeExerciseByIdFromDB = async (id: string) => {
  const result = await StabilizeExercise.findById(id).populate(
    'category',
    'name',
  );

  if (!result) throw new AppError(404, 'Stabilize exercise not found');
  if (result.isDeleted)
    throw new AppError(400, 'This stabilize exercise has been deleted');

  return result;
};

const updateStabilizeExerciseIntoDB = async (
  id: string,
  payload: Partial<TStabilizeExercise>,
  files: any,
) => {
  const isExerciseExists = await StabilizeExercise.findById(id);

  if (!isExerciseExists)
    throw new AppError(404, 'Stabilize exercise does not exist');
  if (isExerciseExists.isDeleted)
    throw new AppError(400, 'This stabilize exercise has been deleted');

  if (payload.name && payload.name !== isExerciseExists.name) {
    const isDuplicateName = await StabilizeExercise.findOne({
      name: payload.name,
      trainer: isExerciseExists.trainer,
      user: isExerciseExists.user,
      category: isExerciseExists.category,
      isDeleted: false,
    });

    if (isDuplicateName) {
      throw new AppError(400, 'Exercise name already exists in this category');
    }
  }

  if (files) {
    const { video } = files as { video?: any[] };
    if (video?.length) {
      try {
        if (isExerciseExists.video?.key) {
          await deleteFromS3(isExerciseExists.video.key);
        }
        const uploaded = await uploadManyToS3([
          { file: video[0], path: 'videos/exercise' },
        ]);
        payload.video = uploaded[0];
      } catch (error) {
        throw new AppError(500, 'Video update failed');
      }
    }
  }

  if (payload.isPublic === true) {
    payload.user = undefined;
  }

  try {
    const updatedExercise = await StabilizeExercise.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedExercise)
      throw new AppError(400, 'Stabilize exercise update failed');

    return updatedExercise;
  } catch (error: any) {
    console.error('updateStabilizeExerciseIntoDB Error:', error);
    throw new AppError(500, 'Failed to update stabilize exercise');
  }
};

const deleteStabilizeExerciseFromDB = async (id: string) => {
  const isExerciseExists = await StabilizeExercise.findById(id);

  if (!isExerciseExists)
    throw new AppError(404, 'Stabilize exercise not found');
  if (isExerciseExists.isDeleted)
    throw new AppError(400, 'Stabilize exercise is already deleted');

  const result = await StabilizeExercise.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!result) throw new AppError(400, 'Failed to delete stabilize exercise');

  return result;
};

export const StabilizeExerciseServices = {
  createStabilizeExerciseIntoDB,
  getStabilizeExercisesForClientFromDB,
  getStabilizeExerciseByIdFromDB,
  updateStabilizeExerciseIntoDB,
  deleteStabilizeExerciseFromDB,
};
