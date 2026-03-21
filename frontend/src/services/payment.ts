import api from './api';
import { PaymentInitResponse } from '@/types';

export const paymentService = {
    async initializePayment(orderId: number, callbackUrl: string): Promise<PaymentInitResponse> {
        try {
            const response = await api.post('/payments/initialize/', {
                order_id: orderId,
                callback_url: callbackUrl
            });
            return response.data;
        } catch (error) {
            console.error('Payment initialization failed:', error);
            throw error;
        }
    }
};
