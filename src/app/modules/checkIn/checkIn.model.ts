import { model, Schema } from 'mongoose';
import { TCheckIn } from './checkIn.interface';

const CheckInSchema = new Schema<TCheckIn>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    metric: {
      type: Schema.Types.ObjectId,
      ref: 'Metric',
      required: true,
    },
    proofType: {
      type: String,
      enum: ['text', 'photo'],
    },
    note: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    checkInDate: {
      type: String,
      required: [true, 'Check-in date is required'],
    },
  },
  {
    timestamps: true,
  },
);

export const CheckIn = model<TCheckIn>('CheckIn', CheckInSchema);
