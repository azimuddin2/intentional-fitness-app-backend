import { Schema, model } from 'mongoose';
import { IChat, IChatModel } from './chat.interface';

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['accepted', 'blocked'],
      default: 'accepted',
    },
  },
  { timestamps: true },
);

export const Chat = model<IChat, IChatModel>('Chat', chatSchema);
