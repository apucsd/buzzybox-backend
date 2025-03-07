import config from '../../../config';

// Helper function to format amount in cents for Stripe
export const formatAmountForStripe = (amount: number, currency: string): number => {
      const numberFormat = new Intl.NumberFormat(['en-US'], {
            style: 'currency',
            currency: currency,
            currencyDisplay: 'symbol',
      });
      const parts = numberFormat.formatToParts(amount);
      let zeroDecimalCurrency = true;

      for (const part of parts) {
            if (part.type === 'decimal') {
                  zeroDecimalCurrency = false;
            }
      }

      return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

// Function to get Stripe public key
export const getStripePublicKey = (): string => {
      return config.stripe.public_key as string;
};

// Function to generate a unique payment reference
export const generatePaymentReference = (prefix = 'PAY'): string => {
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(2, 10);
      return `${prefix}_${timestamp}_${randomStr}`;
};

// Function to validate payment amount
export const validatePaymentAmount = (amount: number): boolean => {
      return amount > 0 && amount <= 999999.99; // Stripe has a maximum limit
};

// Helper to extract customer info from request
export const extractCustomerInfo = (req: any) => {
      const { email, name, customerId } = req.body;

      return {
            email,
            name,
            customerId,
      };
};

// Helper to create line items for checkout session
export const createLineItems = (items: any[]) => {
      return items.map((item) => ({
            price_data: {
                  currency: item.currency || 'usd',
                  product_data: {
                        name: item.name,
                        description: item.description,
                        images: item.images,
                  },
                  unit_amount: formatAmountForStripe(item.amount, item.currency || 'usd'),
            },
            quantity: item.quantity || 1,
      }));
};
