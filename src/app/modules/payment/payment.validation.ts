import { z } from 'zod';

const createCheckoutSessionZodSchema = z.object({
      giftCardId: z.string({ required_error: 'Gift card ID is required' }),
      emailScheduleDate: z.coerce.date().refine((date) => date > new Date(), {
            message: 'Date must be in the future',
      }),
      message: z.string().optional(),
      email: z.string().email({
            message: 'Invalid email address format',
      }),
      url: z.string().url({
            message: 'Invalid URL format',
      }),
});

export const PaymentValidation = { createCheckoutSessionZodSchema };
