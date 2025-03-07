import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();
router.post('/create-payment-link', auth(USER_ROLES.USER), PaymentController.createPaymentLink);
router.get('/all-payments', PaymentController.getAllPayments); // add admin role after implementation
router.get('/my-payments', auth(USER_ROLES.USER), PaymentController.getMyPayments);

export const PaymentRoutes = router;
