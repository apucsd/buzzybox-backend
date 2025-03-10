import catchAsync from '../../../shared/catchAsync';
import { AnalysisService } from './analysis.service';

const getAllAnalysis = catchAsync(async (req, res) => {
      const result = await AnalysisService.getAllAnalysisFromDB();
      res.status(200).json({
            success: true,
            message: 'Stats fetched successfully',
            data: result,
      });
});

const getMonthlyAnalysis = catchAsync(async (req, res) => {
      const result = await AnalysisService.getMonthlyEarningsFromDB();
      res.status(200).json({
            success: true,
            message: 'Monthly earnings fetched successfully',
            data: result,
      });
});

const getMonthlyUsers = catchAsync(async (req, res) => {
      const result = await AnalysisService.getMonthlyUsersFromDB();
      res.status(200).json({
            success: true,
            message: 'Monthly users fetched successfully',
            data: result,
      });
});

const getMonthlyTotalGiftSend = catchAsync(async (req, res) => {
      const result = await AnalysisService.getMonthlyTotalGiftSendFromDB();
      res.status(200).json({
            success: true,
            message: 'Monthly total gift send fetched successfully',
            data: result,
      });
});

export const AnalysisController = {
      getAllAnalysis,
      getMonthlyAnalysis,
      getMonthlyUsers,
      getMonthlyTotalGiftSend,
};
