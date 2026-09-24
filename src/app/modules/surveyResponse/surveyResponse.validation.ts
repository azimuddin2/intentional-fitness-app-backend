import { z } from 'zod';

const answerSchema = z.object({
  question: z.string({ required_error: 'Question ID is required' }),
  answerValue: z.union([z.string(), z.array(z.string())], {
    required_error: 'Answer value is required',
  }),
});

const submitSurveyResponseValidationSchema = z.object({
  body: z.object({
    survey: z.string({ required_error: 'Survey ID is required' }),
    answers: z.array(answerSchema).min(1, 'At least one answer is required'),
  }),
});

export const SurveyResponseValidation = {
  submitSurveyResponseValidationSchema,
};
