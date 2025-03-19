import QueryBuilder from '../../../builder/QueryBuilder';
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

const getAllTransactionsFromDB = async (query: Record<string, any>) => {
      const giftCardQuery = GiftCard.find().populate({
            path: 'userId',
            match: query.searchTerm
                  ? {
                          $or: [
                                { email: { $regex: query.searchTerm, $options: 'i' } },
                                { name: { $regex: query.searchTerm, $options: 'i' } },
                          ],
                    }
                  : {},
      });

      const queryBuilder = new QueryBuilder(giftCardQuery, query)
            .populateFields('userId')
            .search(['name', 'userId.name', 'userId.email'])
            .sort()
            .paginate();

      const result = await queryBuilder.modelQuery;
      const meta = await queryBuilder.countTotal();
      return {
            meta,
            result,
      };
};
export const PaymentService = { createCheckoutSession, getAllTransactionsFromDB };
