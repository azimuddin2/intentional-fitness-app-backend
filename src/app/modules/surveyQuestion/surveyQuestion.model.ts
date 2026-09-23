import { model, Schema } from 'mongoose';
import { TSurveyQuestion } from './surveyQuestion.interface';
import { QuestionType } from './surveyQuestion.constant';

const SurveyQuestionSchema = new Schema<TSurveyQuestion>(
  {
    survey: {
      type: Schema.Types.ObjectId,
      ref: 'Survey',
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    questionType: {
      type: String,
      enum: {
        values: QuestionType,
        message: '{VALUE} is not valid',
      },
      required: [true, 'Question type is required'],
    },
    options: {
      type: [String],
      default: undefined,
    },
    isRequired: {
      type: Boolean,
      default: false,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const SurveyQuestion = model<TSurveyQuestion>(
  'SurveyQuestion',
  SurveyQuestionSchema,
);
