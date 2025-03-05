import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryToDB = async (payload: ICategory) => {
      const result = await Category.create(payload);
      if (!result) {
            throw new Error('Failed to create category');
      }
      return result;
};
const updateCategoryToDB = async (id: string, payload: Partial<ICategory>) => {
      const result = await Category.findOneAndUpdate({ _id: id }, payload, {
            new: true,
      });
      if (!result) {
            throw new Error('Failed to update category');
      }
      return result;
};
const getAllCategoriesFromDB = async () => {
      const result = await Category.find();
      if (!result) {
            throw new Error('Failed to get categories');
      }
      return result;
};

export const CategoryService = {
      createCategoryToDB,
      getAllCategoriesFromDB,
      updateCategoryToDB,
};
