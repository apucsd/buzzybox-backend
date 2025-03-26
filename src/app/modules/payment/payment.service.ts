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
            success_url: 'http://10.0.70.128:3004/dashboard/gift-history',
            cancel_url: 'http://10.0.70.128:3004/dashboard/gift-history',
            line_items: [
                  {
                        price: price.id,
                        quantity: 1,
                  },
            ],
      });
      console.log({ checkoutSession }, 'checkoutSession');

      giftCard.paymentIntentId = checkoutSession.id;

      await giftCard.save();

      return {
            url: checkoutSession.url,
            paymentIntentId: checkoutSession.id,
            giftCardId: giftCard._id,
      };
};

const getAllTransactionsFromDB = async (query: Record<string, any>) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const skip = (page - 1) * limit;
      const sortBy = query.sortBy || 'user.name';
      const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
      const regexSearchTerm = typeof query.searchTerm === 'string' ? query.searchTerm : '';
      const result = await GiftCard.aggregate([
            {
                  $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                  },
            },
            {
                  $unwind: '$user',
            },
            {
                  $match: {
                        $or: [
                              { 'user.name': { $regex: regexSearchTerm, $options: 'i' } },
                              { 'user.email': { $regex: regexSearchTerm, $options: 'i' } },
                        ],
                  },
            },

            {
                  $project: {
                        _id: 1,
                        user: {
                              _id: 1,
                              name: 1,
                              email: 1,
                              profile: 1,
                              status: 1,
                              contact: 1,
                        },
                        giftCardId: 1,
                        paymentIntentId: 1,
                        amount: 1,
                        price: 1,
                        paymentStatus: 1,
                        coverPage: 1,
                  },
            },

            {
                  $facet: {
                        metadata: [{ $count: 'total' }, { $addFields: { page, limit } }],
                        data: [{ $sort: { [sortBy]: sortOrder } }, { $skip: skip }, { $limit: limit }],
                  },
            },
            { $unwind: '$metadata' },
            {
                  $project: {
                        data: 1,
                        meta: {
                              page: '$metadata.page',
                              limit: '$metadata.limit',
                              total: '$metadata.total',
                              totalPage: { $ceil: { $divide: ['$metadata.total', '$metadata.limit'] } },
                        },
                  },
            },
      ]).exec();

      if (!result) {
            return {
                  meta: {
                        page,
                        limit,
                        total: 0,
                        totalPage: 0,
                  },
                  data: [],
            };
      }

      return result;
};
export const PaymentService = { createCheckoutSession, getAllTransactionsFromDB };
