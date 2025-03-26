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
                        // console.log(session, 'session===================================');

                        const giftCard = await GiftCard.findOne({ paymentIntentId: session.id });
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
// const product = await stripe.products.create({
//       name: 'Classic Buzzybox',
// });
// const price = await stripe.prices.create({
//       product: product.id,
//       unit_amount: 100 * 100,
//       currency: 'usd',
// });
// const checkoutSession = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel',
//       line_items: [
//             {
//                   price: price.id,
//                   quantity: 1,
//             },
//       ],
// });

// payload.paymentStatus = 'pending';
// payload.userId = userId;
// payload.status = 'pending';
// payload.paymentIntentId = checkoutSession.id;
