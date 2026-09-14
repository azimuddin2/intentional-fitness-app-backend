import { model, Schema } from 'mongoose';
import { TDoc } from './doc.interface';

const DocSchema = new Schema<TDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    file: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Doc = model<TDoc>('Doc', DocSchema);
