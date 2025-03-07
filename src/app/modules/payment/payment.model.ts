import mongoose, { Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
      {
            amount: {
                  type: Number,
                  required: true,
            },
            userId: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },
            email: {
                  type: String,
                  required: true,
            },
            status: {
                  type: String,
                  enum: ['pending', 'complete', 'failed', 'refunded', 'canceled', 'expired'],
                  default: 'pending',
            },
            transactionId: {
                  type: String,
                  required: true,
                  unique: true,
            },
            currency: {
                  type: String,
                  required: true,
                  default: 'usd',
            },
      },
      {
            timestamps: true,
      }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
