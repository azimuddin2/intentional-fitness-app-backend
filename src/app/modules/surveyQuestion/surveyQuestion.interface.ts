import { ObjectId } from 'mongoose';

export type TQuestionType =
  | 'short_text'
  | 'long_text'
  | 'date'
  | 'single_select'
  | 'multi_select';

export type TSurveyQuestion = {
  _id?: string;
  survey: ObjectId;
  questionText: string;
  questionType: TQuestionType;
  options?: string[];
  isRequired?: boolean;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
};
