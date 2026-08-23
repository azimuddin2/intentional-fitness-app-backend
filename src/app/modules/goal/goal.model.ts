import { model, Schema } from 'mongoose';
import { TGoal } from './goal.interface';

const GoalSchema = new Schema<TGoal>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Goal = model<TGoal>('Goal', GoalSchema);
