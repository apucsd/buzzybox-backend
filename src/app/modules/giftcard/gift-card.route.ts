import { Router } from 'express';
import { GiftCardController } from './gift-card.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = Router();

router.post('/create-gift-card', auth(USER_ROLES.USER), GiftCardController.createGiftCard);
router.post('/create-checkout-session', auth(USER_ROLES.USER), GiftCardController.createCheckoutSession);
router.patch('/add-new-page/:id', fileUploadHandler(), GiftCardController.updateGiftCard);
router.patch('/remove-page/:id', GiftCardController.removePage);

router.get('/', GiftCardController.getAllGiftCards);

export const GiftCardRoutes = router;
