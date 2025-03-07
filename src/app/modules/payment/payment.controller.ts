import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PaymentService } from './payment.service';

const createPaymentLink = catchAsync(async (req: Request, res: Response) => {
      const paymentData = req.body;
      const userId = req.user?.id;
      const result = await PaymentService.createPaymentLink(paymentData, userId);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Payment link created successfully',
            data: result,
      });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
      const result = await PaymentService.getAllPaymentsFromDB();

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Payments retrieved successfully',
            data: result,
      });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
      const userId = req.user?.id;
      const result = await PaymentService.getUserPaymentsFromDB(userId);

      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'User payments retrieved successfully',
            data: result,
      });
});

export const PaymentController = {
      createPaymentLink,
      getAllPayments,

      getMyPayments,
};
