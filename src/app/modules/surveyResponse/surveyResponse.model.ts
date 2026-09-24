import { model, Schema } from 'mongoose';
import { TSurveyResponse } from './surveyResponse.interface';

const AnswerSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: 'SurveyQuestion',
      required: true,
    },
    answerValue: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false },
);

const SurveyResponseSchema = new Schema<TSurveyResponse>(
  {
    survey: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    answers: {
      type: [AnswerSchema],
      default: [],
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const SurveyResponse = model<TSurveyResponse>(
  'SurveyResponse',
  SurveyResponseSchema,
);
