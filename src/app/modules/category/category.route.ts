import { Router } from 'express';
import { CategoryController } from './category.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

router.post('/create-category', fileUploadHandler(), CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);

export const CategoryRoutes = router;
