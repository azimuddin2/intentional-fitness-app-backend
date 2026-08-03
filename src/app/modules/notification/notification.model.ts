import { model, Schema } from 'mongoose';
import { INotification } from './notification.interface';
import { Types } from './notification.constant';
import { UserRole } from '../user/user.constant';

const NotificationSchema = new Schema<INotification>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: '',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverEmail: {
      type: String,
      default: '',
    },
    receiverRole: {
      type: String,
      enum: {
        values: UserRole,
        message: '{VALUE} is not valid',
      },
      required: true,
    },
    type: {
      type: String,
      enum: {
        values: Types,
        message: '{VALUE} is not valid',
      },
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: null,
    },
    fcmToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = model<INotification>('Notification', NotificationSchema);
export default Notification;
