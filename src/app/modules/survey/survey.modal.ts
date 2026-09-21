import { model, Schema } from 'mongoose';
import { TSurvey } from './survey.interface';

const SurveySchema = new Schema<TSurvey>(
  {
    title: {
      type: String,
      required: [true, 'Survey title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Survey = model<TSurvey>('Survey', SurveySchema);
