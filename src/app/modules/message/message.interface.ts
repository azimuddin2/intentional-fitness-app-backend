import { Model, ObjectId } from 'mongoose';

export type TMessage = {
  _id?: ObjectId;
  id?: string;
  text?: string;
  imageUrl?: string[];
  seen: boolean;
  chat: ObjectId;
  sender: ObjectId;
  receiver: ObjectId;
};

export type TMessageModel = Model<TMessage, Record<string, unknown>>;
