import stripe from '../../config/stripe.config';
import config from '../../../config';
import { IPayment, IPaymentIntent } from './payment.interface';
import { Payment } from './payment.model';
import mongoose from 'mongoose';

const createPaymentLink = async (payload: IPaymentIntent, userId: string) => {
      try {
            const product = await stripe.products.create({
                  name: 'Classic Buzzybox',
            });
            const price = await stripe.prices.create({
                  product: product.id,
                  unit_amount: payload.amount * 100,
                  currency: payload.currency || 'usd',
            });
            const paymentLink = await stripe.paymentLinks.create({
                  line_items: [
                        {
                              price: price.id,
                              quantity: 1,
                        },
                  ],
                  metadata: {
                        userId: userId,
                        ...payload.metadata,
                  },
            });

            return {
                  url: paymentLink.url,
            };
      } catch (error) {
            throw new Error(`Error creating payment link: ${(error as Error).message}`);
      }
};

const savePaymentRecordToDB = async (paymentData: IPayment) => {
      try {
            const payment = await Payment.create(paymentData);
            return payment;
      } catch (error) {
            throw new Error(`Error saving payment record: ${(error as Error).message}`);
      }
};

const getAllPaymentsFromDB = async () => {
      try {
            const payments = await Payment.find().sort({ createdAt: -1 });
            return payments;
      } catch (error) {
            throw new Error(`Error fetching payments: ${(error as Error).message}`);
      }
};

const getUserPaymentsFromDB = async (userId: string) => {
      console.log(userId);
      try {
            const payments = await Payment.findOne({ userId }).sort({ createdAt: -1 });
            return payments;
      } catch (error) {
            throw new Error(`Error fetching user payments: ${(error as Error).message}`);
      }
};

export const PaymentService = {
      createPaymentLink,

      savePaymentRecordToDB,
      getAllPaymentsFromDB,
      getUserPaymentsFromDB,
};
