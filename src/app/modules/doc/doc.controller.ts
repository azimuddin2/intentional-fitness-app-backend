import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DocServices } from './doc.service';
import AppError from '../../errors/AppError';

const createDoc = catchAsync(async (req: Request, res: Response) => {
  // userId ekhon body theke asbe (req.body.user)
  const result = await DocServices.createDocIntoDB(req.body, req.file);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Doc added successfully',
    data: result,
  });
});

const getDocsByUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.query.user as string;

  if (!userId) {
    throw new AppError(400, 'User ID is required');
  }

  const result = await DocServices.getDocsFromDB(userId, req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Docs retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getDocById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DocServices.getDocByIdFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doc retrieved successfully',
    data: result,
  });
});

const updateDoc = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DocServices.updateDocIntoDB(id, req.body, req.file);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doc updated successfully',
    data: result,
  });
});

const deleteDoc = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DocServices.deleteDocFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Doc deleted successfully',
    data: result,
  });
});

export const DocControllers = {
  createDoc,
  getDocsByUser,
  getDocById,
  updateDoc,
  deleteDoc,
};
