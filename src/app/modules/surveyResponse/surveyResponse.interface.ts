import { ObjectId } from 'mongoose';
import { TUser } from '../user/user.interface';
import { TSurvey } from '../survey/survey.interface';
import { TSurveyQuestion } from '../surveyQuestion/surveyQuestion.interface';

export type TResponseStatus = 'in_progress' | 'completed';

export type TAnswer = {
  question: ObjectId | TSurveyQuestion;
  answerValue: string | string[];
};

export type TSurveyResponse = {
  _id?: string;
  survey: ObjectId | TSurvey;
  user: ObjectId | TUser;
  trainer: ObjectId | TUser;
  status?: TResponseStatus;
  answers: TAnswer[];
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};
