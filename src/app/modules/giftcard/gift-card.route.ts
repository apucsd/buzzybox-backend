import { Router } from 'express';
import { GiftCardController } from './gift-card.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = Router();

router.post('/create-gift-card', auth(USER_ROLES.USER), GiftCardController.createGiftCard);
router.get('/', GiftCardController.getAllGiftCards);

export const GiftCardRoutes = router;
