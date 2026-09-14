import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TDoc } from './doc.interface';
import { Doc } from './doc.model';
import mongoose from 'mongoose';
import { deleteFromS3, uploadToS3 } from '../../utils/awsS3FileUploader';

const createDocIntoDB = async (payload: TDoc, file?: Express.Multer.File) => {
  const docPayload: Record<string, any> = { ...payload };

  if (file) {
    const uploadedUrl = await uploadToS3({
      file,
      fileName: `docs/${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    docPayload.file = uploadedUrl;
  }

  const result = await Doc.create(docPayload);

  if (!result) {
    throw new AppError(400, 'Failed to create doc');
  }

  return result;
};

const getDocsFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError(400, 'Invalid user ID');
  }

  const docQuery = new QueryBuilder(
    Doc.find({
      user: userId,
    }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await docQuery.countTotal();
  const result = await docQuery.modelQuery;

  return { meta, result };
};

const getDocByIdFromDB = async (id: string) => {
  const result = await Doc.findById(id);

  if (!result) {
    throw new AppError(404, 'Doc not found');
  }

  return result;
};

const updateDocIntoDB = async (
  id: string,
  payload: Partial<TDoc>,
  file?: Express.Multer.File,
) => {
  const isDocExists = await Doc.findById(id);

  if (!isDocExists) {
    throw new AppError(404, 'Doc does not exist');
  }

  const updatePayload: Record<string, any> = { ...payload };

  if (file) {
    const uploadedUrl = await uploadToS3({
      file,
      fileName: `docs/${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    });

    if (isDocExists.file) {
      await deleteFromS3(isDocExists.file);
    }

    updatePayload.file = uploadedUrl;
  }

  const updatedDoc = await Doc.findByIdAndUpdate(id, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!updatedDoc) {
    throw new AppError(400, 'Doc update failed');
  }

  return updatedDoc;
};

const deleteDocFromDB = async (id: string) => {
  const isDocExists = await Doc.findById(id);

  if (!isDocExists) {
    throw new AppError(404, 'Doc not found');
  }

  if (isDocExists.file) {
    await deleteFromS3(isDocExists.file);
  }

  const result = await Doc.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(400, 'Failed to delete doc');
  }

  return result;
};

export const DocServices = {
  createDocIntoDB,
  getDocsFromDB,
  getDocByIdFromDB,
  updateDocIntoDB,
  deleteDocFromDB,
};
