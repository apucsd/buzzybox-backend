import { model, Schema } from 'mongoose';
import { IGiftCard } from './gift-card.interface';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

const giftCardSchema = new Schema<IGiftCard>(
      {
            uniqueId: { type: String, required: true, unique: true },
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
            image: { type: String, required: true },
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
                        image: { type: String },
                        message: { type: String },
                        senderName: { type: String },
                  },
            ],

            status: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' },
            paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
      },
      {
            timestamps: true,
      }
);

giftCardSchema.post('save', async function (doc, next) {
      if (this.isNew) {
            const existingGiftCard = await GiftCard.findOne({ uniqueId: doc.uniqueId });

            if (existingGiftCard) {
                  throw new ApiError(StatusCodes.BAD_REQUEST, 'Gift card already exists');
            }
      }
      next();
});

export const GiftCard = model<IGiftCard>('GiftCard', giftCardSchema);
