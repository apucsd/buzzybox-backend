import catchAsync from '../../../shared/catchAsync';
import { GiftCardService } from './gift-card.service';

const createGiftCard = catchAsync(async (req, res) => {
      const payload = req.body;
      const userId = req.user.id;
      console.log(userId);
      const result = await GiftCardService.createGiftCardToDB(payload, userId);
      res.status(200).json({
            success: true,
            message: 'Gift card created successfully',
            data: result,
      });
});

const getAllGiftCards = catchAsync(async (req, res) => {
      const result = await GiftCardService.getAllGiftCardsFromDB();
      res.status(200).json({
            success: true,
            message: 'Gift cards fetched successfully',
            data: result,
      });
});

export const GiftCardController = {
      createGiftCard,
      getAllGiftCards,
};
