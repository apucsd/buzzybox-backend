import QueryBuilder from '../../../builder/QueryBuilder';
import stripe from '../../config/stripe.config';
import { Category } from '../category/category.model';

import { IGiftCard } from './gift-card.interface';
import { GiftCard } from './gift-card.model';
import mongoose from 'mongoose';

const createGiftCardToDB = async (payload: IGiftCard, userId: string) => {
      try {
            const category = await Category.findById(payload.category);
            if (!category) {
                  throw new Error('Category not found');
            }

            payload.userId = new mongoose.Types.ObjectId(userId);
            payload.image = category.occasionImage;
            payload.price = 5;
            const result = await GiftCard.create(payload);
            if (!result) {
                  throw new Error('Failed to create gift card');
            }
            return result;
      } catch (error) {
            throw new Error(`Error creating payment link: ${(error as Error).message}`);
      }
};

const updateGiftCardToDB = async (payload: Partial<IGiftCard> & { page: any }, id: string, files: any) => {
      let newPage: any = payload.page ? JSON.parse(payload.page as string) : null;

      if (files && 'image' in files) {
            payload.image = `/${files.image[0].filename}`;
      }
      if (files && 'pageImage' in files) {
            newPage.image = `/${files.pageImage[0].filename}`;
      }

      const giftCard = await GiftCard.findById(id);
      if (!giftCard) {
            throw new Error('Gift card not found');
      }

      const result = await GiftCard.findByIdAndUpdate(
            id,
            {
                  $push: { pages: newPage },
                  ...payload,
            },
            { new: true }
      );

      return result;
};

const removePageFromGiftCard = async (id: string, pageId: string) => {
      const result = await GiftCard.findByIdAndUpdate(id, { $pull: { pages: { _id: pageId } } }, { new: true });
      if (!result) {
            throw new Error('Failed to remove page from gift card');
      }
      return result;
};

const getGiftCardByUniqueId = async (id: string) => {
      const result = await GiftCard.findOne({ uniqueId: id });
      if (!result) {
            throw new Error('Gift card not found');
      }
      return result;
};

const getAllGiftCardsFromDB = async (): Promise<IGiftCard[]> => {
      const result = await GiftCard.find({ paymentStatus: 'paid' });
      if (!result) {
            throw new Error('Failed to get gift cards');
      }
      return result;
};

const getMyGiftCardsFromDB = async (userId: string) => {
      console.log(userId);
      const result = await GiftCard.find({ userId, paymentStatus: 'paid' });

      if (!result) {
            throw new Error('Failed to get my gift cards');
      }
      return result;
};

const deleteGiftCardFromDB = async (id: string) => {
      const result = await GiftCard.findByIdAndDelete(id);
      if (!result) {
            throw new Error('Card not found');
      }
      return result;
};
const countGiftCardsByUserFromDB = async (searchTerm: string) => {
      const regexSearchTerm = typeof searchTerm === 'string' ? searchTerm : '';
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
                  $group: {
                        _id: '$userId',
                        user: { $first: '$user' },
                        count: { $sum: 1 },
                  },
            },
            {
                  $project: {
                        _id: 0,
                        userId: '$_id',
                        user: 1,
                        count: 1,
                  },
            },
      ]).exec();

      console.log('Aggregation Result:', result);

      return result;
};
export const GiftCardService = {
      createGiftCardToDB,
      getAllGiftCardsFromDB,
      updateGiftCardToDB,
      removePageFromGiftCard,
      getMyGiftCardsFromDB,
      getGiftCardByUniqueId,
      deleteGiftCardFromDB,
      countGiftCardsByUserFromDB,
};
