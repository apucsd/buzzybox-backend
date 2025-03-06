import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ContactRoutes } from '../app/modules/contact/contact.route';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { AboutRoutes } from '../app/modules/about/about.route';

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
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
