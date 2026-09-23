import { z } from 'zod';
import { QuestionType } from './surveyQuestion.constant';

const createSurveyQuestionValidationSchema = z.object({
  body: z
    .object({
      survey: z.string({ required_error: 'Survey ID is required' }),
      questionText: z
        .string({ required_error: 'Question text is required' })
        .min(1, 'Question text cannot be empty'),
      questionType: z.enum([...QuestionType] as [string, ...string[]]),
      options: z.array(z.string()).optional(),
      isRequired: z.boolean().optional().default(false),
    })
    .refine(
      (data) => {
        if (['single_select', 'multi_select'].includes(data.questionType)) {
          return data.options && data.options.length > 0;
        }
        return true;
      },
      {
        message: 'Options are required for select-type questions',
        path: ['options'],
      },
    ),
});

const updateSurveyQuestionValidationSchema = z.object({
  body: z.object({
    questionText: z.string().min(1, 'Question text cannot be empty').optional(),
    questionType: z.enum([...QuestionType] as [string, ...string[]]).optional(),
    options: z.array(z.string()).optional(),
    isRequired: z.boolean().optional(),
  }),
});

export const SurveyQuestionValidation = {
  createSurveyQuestionValidationSchema,
  updateSurveyQuestionValidationSchema,
};
