import catchAsync from '../../../shared/catchAsync';
import { GiftCardService } from './gift-card.service';

const createGiftCard = catchAsync(async (req, res) => {
      const payload = req.body;
      const userId = req.user?.id;
      const result = await GiftCardService.createGiftCardToDB(payload, userId as string);
      res.status(200).json({
            success: true,
            message: 'Gift card created successfully',
            data: result,
      });
});

const updateGiftCard = catchAsync(async (req, res) => {
      const payload = req.body;
      const result = await GiftCardService.updateGiftCardToDB(payload, req.params.id, req.files);
      res.status(200).json({
            success: true,
            message: 'Gift card updated successfully',
            data: result,
      });
});

const removePage = catchAsync(async (req, res) => {
      const result = await GiftCardService.removePageFromGiftCard(req.params.id, req.body.pageId);
      res.status(200).json({
            success: true,
            message: 'Page removed successfully',
            data: result,
      });
});

// checkout
const createCheckoutSession = catchAsync(async (req, res) => {
      const { giftCardId } = req.body;
      const result = await GiftCardService.createCheckoutSession(giftCardId);
      res.status(200).json({
            success: true,
            message: 'Checkout session created successfully',
            data: result,
      });
});

const getGiftCardByUniqueId = catchAsync(async (req, res) => {
      const { id } = req.params;
      const result = await GiftCardService.getGiftCardByUniqueId(id);
      res.status(200).json({
            success: true,
            message: 'Gift card fetched successfully',
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

const getMyGiftCards = catchAsync(async (req, res) => {
      const userId = req.user?.id;
      const result = await GiftCardService.getMyGiftCardsFromDB(userId as string);
      res.status(200).json({
            success: true,
            message: 'My gift cards fetched successfully',
            data: result,
      });
});

const deleteGiftCard = catchAsync(async (req, res) => {
      const { id } = req.params;
      const result = await GiftCardService.deleteGiftCardFromDB(id);
      res.status(200).json({
            success: true,
            message: 'Gift card deleted successfully',
            data: result,
      });
});

export const GiftCardController = {
      createGiftCard,
      getAllGiftCards,
      updateGiftCard,
      removePage,
      createCheckoutSession,
      getMyGiftCards,
      getGiftCardByUniqueId,
      deleteGiftCard,
};
