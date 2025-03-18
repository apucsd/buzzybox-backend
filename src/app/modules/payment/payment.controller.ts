import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';

// checkout
const createCheckoutSession = catchAsync(async (req, res) => {
      const { giftCardId } = req.body;
      const result = await PaymentService.createCheckoutSession(giftCardId);
      res.status(200).json({
            success: true,
            message: 'Checkout session created successfully',
            data: result,
      });
});
export const PaymentController = { createCheckoutSession };
