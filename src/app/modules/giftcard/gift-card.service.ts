import stripe from '../../config/stripe.config';
import { IGiftCard } from './gift-card.interface';
import { GiftCard } from './gift-card.model';
import mongoose from 'mongoose';

const createGiftCardToDB = async (payload: IGiftCard, userId: mongoose.Types.ObjectId) => {
      try {
            const product = await stripe.products.create({
                  name: 'Classic Buzzybox',
            });
            const price = await stripe.prices.create({
                  product: product.id,
                  unit_amount: 100 * 100,
                  currency: 'usd',
            });
            const checkoutSession = await stripe.checkout.sessions.create({
                  payment_method_types: ['card'],
                  mode: 'payment',
                  success_url: 'http://localhost:3000/success',
                  cancel_url: 'http://localhost:3000/cancel',
                  line_items: [
                        {
                              price: price.id,
                              quantity: 1,
                        },
                  ],
            });

            payload.paymentStatus = 'pending';
            payload.userId = userId;
            payload.status = 'pending';
            payload.paymentIntentId = checkoutSession.id;

            const result = await GiftCard.create(payload);
            if (!result) {
                  throw new Error('Failed to create gift card');
            }
            return {
                  url: checkoutSession.url,
            };
      } catch (error) {
            throw new Error(`Error creating payment link: ${(error as Error).message}`);
      }
};

const getAllGiftCardsFromDB = async (): Promise<IGiftCard[]> => {
      const result = await GiftCard.find();
      if (!result) {
            throw new Error('Failed to get gift cards');
      }
      return result;
};

export const GiftCardService = {
      createGiftCardToDB,
      getAllGiftCardsFromDB,
};
