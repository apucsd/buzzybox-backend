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
            payload.price = 5; // static price
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

const countGiftCardsByUserFromDB = async (query: Record<string, any>) => {
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

      const queryBuilder = new QueryBuilder(giftCardQuery, query).sort().paginate();

      const result = await queryBuilder.modelQuery;
      const meta = await queryBuilder.countTotal();

      // Filter out documents where userId is null (due to population match)
      const filteredResult = result.filter((card) => card.userId !== null);

      // Create a map to count gift cards per user
      const userCardCountMap = new Map<string, { user: any; giftCardCount: number }>();

      filteredResult.forEach((card) => {
            const userId = card.userId._id.toString();
            if (userCardCountMap.has(userId)) {
                  userCardCountMap.get(userId)!.giftCardCount += 1;
            } else {
                  userCardCountMap.set(userId, {
                        user: card.userId,
                        giftCardCount: 1,
                  });
            }
      });

      // Convert map to array
      const formattedData = Array.from(userCardCountMap.values());

      return {
            meta,
            result: formattedData,
      };
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
