import api from './api';

export const orderService = {
    async checkout() {
        try {
            const response = await api.post('/orders/checkout/');
            return response.data;
        } catch (error) {
            console.error('Checkout failed:', error);
            throw error;
        }
    },
    
    async getOrders() {
        try {
            const response = await api.get('/orders/orders/');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw error;
        }
    }
};
