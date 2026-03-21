import api from './api';

export const paymentService = {
    async initializePayment(orderId: number, callbackUrl: string) {
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
