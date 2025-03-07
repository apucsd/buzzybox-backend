import { Request, Response } from 'express';
import stripe from '../app/config/stripe.config';
import config from '../config';
import { IPayment } from '../app/modules/payment/payment.interface';
import { PaymentService } from '../app/modules/payment/payment.service';
import mongoose from 'mongoose';

const handleStripeWebhook = async (req: Request, res: Response) => {
      const signature = req.headers['stripe-signature'];
      if (!signature) {
            return res.status(400).json({ error: 'Missing stripe-signature header' });
      }
      try {
            const event = stripe.webhooks.constructEvent(req.body, signature, config.stripe.webhook_secret as string);
            switch (event.type) {
                  case 'checkout.session.completed':
                        const session = event.data.object;
                        if (session.status === 'complete') {
                              const userId = session.metadata?.userId;
                              if (!userId) {
                                    console.error('No user ID found in metadata');
                                    return res.status(400).json({ error: 'No user ID found in metadata' });
                              }
                              const userObjectId = new mongoose.Types.ObjectId(userId);
                              const paymentStatus: IPayment['status'] = 'complete';

                              await PaymentService.savePaymentRecordToDB({
                                    amount: session.amount_total ? session.amount_total / 100 : 10,
                                    currency: session.currency || 'usd',
                                    status: paymentStatus,
                                    email: session.customer_details?.email || '',
                                    userId: userObjectId,
                                    transactionId: session.id,
                              });
                              console.log('Payment record saved successfully');
                        } else {
                              console.log('Payment status is not complete. Skipping payment record saving.');
                        }
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
