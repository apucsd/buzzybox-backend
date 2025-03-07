import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import router from './routes';
import { Morgan } from './shared/morgen';

import stripe from './app/config/stripe.config';
import config from './config';
import handleStripeWebhook from './webhook/handleStripeWebhook';
const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

// Stripe webhook endpoint - needs raw body for signature verification
// This must be defined BEFORE any body parsers
const stripeWebhookPath = '/api/v1/stripe/webhook';

app.post(stripeWebhookPath, express.raw({ type: 'application/json' }), handleStripeWebhook);

//body parser - must come AFTER the Stripe webhook route
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);

//live response
app.get('/', (req: Request, res: Response) => {
      res.send(`
            <div style="display:flex; justify-content:center; align-items:center; height:100vh;">
                  <div style="text-align:center;">
                        <h1 style="color:#A55FEF; font-family:Arial, Helvetica, sans-serif; font-size:3rem;">Welcome to my API</h1>
                        <p style="color:#777; font-size:1.5rem;">I'm happy to help you with anything you need.</p>
                  </div>
            </div>
      `);
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
      res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Not found',
            errorMessages: [
                  {
                        path: req.originalUrl,
                        message: `The API route ${req.originalUrl} doesn't exist. Please contact the API owner if you need help`,
                  },
            ],
      });
});

export default app;
