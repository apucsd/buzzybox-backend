import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';
import config from '../../../config';

const createCategory = catchAsync(async (req, res) => {
      if (req.files && 'categoryImage' in req.files) {
            req.body.categoryImage = `http://${config.ip_address}:${config.port}/categories/${req.files.categoryImage[0].filename}`;
      }
      if (req.files && 'occasionImage' in req.files) {
            req.body.occasionImage = `http://${config.ip_address}:${config.port}/occasions/${req.files.occasionImage[0].filename}`;
      }

      const { ...categoryData } = req.body;
      const result = await CategoryService.createCategoryToDB(categoryData);
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Category created successfully',
            data: result,
      });
});
const getAllCategories = catchAsync(async (req, res) => {
      const result = await CategoryService.getAllCategoriesFromDB();
      sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: 'Categories fetched successfully',
            data: result,
      });
});

export const CategoryController = {
      createCategory,
      getAllCategories,
};
