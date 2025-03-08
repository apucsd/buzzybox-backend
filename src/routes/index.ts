import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ContactRoutes } from '../app/modules/contact/contact.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { AboutRoutes } from '../app/modules/about/about.route';
import { FAQRoutes } from '../app/modules/faqs/faq.route';
import { HowItWorksRoutes } from '../app/modules/how-it-works/how-it-works.route';
import { ContactInfoRoutes } from '../app/modules/contact-info/contact-info.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
import { PaymentRoutes } from '../app/modules/payment/payment.route';
import { GiftCardRoutes } from '../app/modules/giftcard/gift-card.route';

const router = express.Router();

const apiRoutes = [
      {
            path: '/users',
            route: UserRoutes,
      },
      {
            path: '/auth',
            route: AuthRoutes,
      },
      {
            path: '/contacts',
            route: ContactRoutes,
      },
      {
            path: '/categories',
            route: CategoryRoutes,
      },
      {
            path: '/about',
            route: AboutRoutes,
      },
      {
            path: '/faqs',
            route: FAQRoutes,
      },
      {
            path: '/how-it-works',
            route: HowItWorksRoutes,
      },
      {
            path: '/contact-info',
            route: ContactInfoRoutes,
      },
      {
            path: '/reviews',
            route: ReviewRoutes,
      },
      {
            path: '/payments',
            route: PaymentRoutes,
      },
      {
            path: '/gift-cards',
            route: GiftCardRoutes,
      },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
