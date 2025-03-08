import { model, Schema } from 'mongoose';
import { IGiftCard } from './gift-card.interface';

const giftCardSchema = new Schema<IGiftCard>(
      {
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
            price: { type: Number },
            paymentIntentId: { type: String },
            email: { type: String },
            coverPage: {
                  recipientName: { type: String, required: true },
                  title: { type: String, required: true },
                  senderName: { type: String, required: true },
            },
            pages: [
                  {
                        image: { type: String, required: true },
                        message: { type: String, required: true },
                        senderName: { type: String, required: true },
                  },
            ],
            status: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' },
            paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
      },
      {
            timestamps: true,
      }
);

export const GiftCard = model<IGiftCard>('GiftCard', giftCardSchema);
