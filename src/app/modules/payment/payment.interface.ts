import { Schema, Types } from 'mongoose';

export interface IPaymentIntent {
      amount: number;
      currency: string;
      description?: string;
      metadata?: Record<string, string>;
      customerId?: string;
      receiptEmail?: string;
      userId?: string; // Add userId field to store the user who initiated the payment
}

export interface IPayment {
      transactionId: string;
      amount: number;
      currency: string;
      status: 'pending' | 'complete' | 'failed' | 'refunded' | 'canceled' | 'expired';
      userId: Types.ObjectId;
      email: string;
}
