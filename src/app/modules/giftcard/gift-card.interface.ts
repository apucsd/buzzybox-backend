import { Types } from 'mongoose';
interface IPage {
      image: string;
      message: string;
      senderName: string;
}

export interface IGiftCard {
      userId: Types.ObjectId;
      category: Types.ObjectId;
      price: number;
      paymentIntentId: string;
      email: string;
      coverPage: {
            recipientName: string;
            title: string;
            senderName: string;
      };
      pages: IPage[];
      status: 'pending' | 'active' | 'expired';
      paymentStatus: 'pending' | 'paid' | 'failed';
}
