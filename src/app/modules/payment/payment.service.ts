import stripe from '../../config/stripe.config';
import { GiftCard } from '../giftcard/gift-card.model';

const createCheckoutSession = async (giftCardId: string) => {
      const giftCard = await GiftCard.findById(giftCardId);
      if (!giftCard) {
            throw new Error('Gift card not found');
      }

      const product = await stripe.products.create({
            name: 'Classic Buzzybox',
      });
      const price = await stripe.prices.create({
            product: product.id,
            unit_amount: 5 * 100,
            currency: 'usd',
      });
      const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: 'http://localhost:3000',
            cancel_url: 'http://localhost:3000',
            line_items: [
                  {
                        price: price.id,
                        quantity: 1,
                  },
            ],
      });
      giftCard.paymentIntentId = checkoutSession.id;

      await giftCard.save();

      return {
            url: checkoutSession.url,
            paymentIntentId: checkoutSession.payment_intent,
            giftCardId: giftCard._id,
      };
};

export const PaymentService = { createCheckoutSession };
