import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
      {
            name: {
                  type: String,
                  required: true,
                  unique: true,
            },
            categoryImage: {
                  type: String,
                  required: true,
            },
            occasionImage: {
                  type: String,
                  required: true,
            },
      },
      {
            timestamps: true,
      }
);

export const Category = model<ICategory>('Category', categorySchema);
