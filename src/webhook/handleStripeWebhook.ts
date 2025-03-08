import { Request, Response } from 'express';
import stripe from '../app/config/stripe.config';
import config from '../config';
import { GiftCard } from '../app/modules/giftcard/gift-card.model';
import Stripe from 'stripe';

const handleStripeWebhook = async (req: Request, res: Response) => {
      const signature = req.headers['stripe-signature'];
      if (!signature) {
            return res.status(400).json({ error: 'Missing stripe-signature header' });
      }
      try {
            const event = stripe.webhooks.constructEvent(req.body, signature, config.stripe.webhook_secret as string);

            switch (event.type) {
                  case 'checkout.session.completed':
                        const session = event.data?.object;
                        const giftCard = await GiftCard.findOne({ paymentIntentId: session.payment_intent });
                        if (!giftCard) {
                              console.log('Gift card not found');
                              return;
                        }
                        giftCard.status = 'active';
                        giftCard.paymentStatus = 'paid';
                        await giftCard.save();
                        console.log('Gift card status updated successfully');

                        break;

                  case 'payment_intent.payment_failed':
                        const paymentIntent = event.data.object as Stripe.PaymentIntent;
                        console.log(paymentIntent, 'paymentIntent');

                        const giftCardFailed = await GiftCard.findOne({ paymentIntentId: paymentIntent.id });

                        if (!giftCardFailed) {
                              console.log('Gift card not found');
                              return;
                        }

                        await giftCardFailed.deleteOne();
                        console.log('Gift card deleted due to failed payment');
                        break;
                  default:
                        console.log(`Unhandled event type: ${event.type}`);
            }

            return res.status(200).json({ received: true });
      } catch (error) {
            console.error('Webhook error:', error);
            return res.status(400).json({ error: `Webhook error: ${(error as Error).message}` });
      }
};

export default handleStripeWebhook;
