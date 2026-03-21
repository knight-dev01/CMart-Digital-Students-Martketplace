import api from './api';
import { Order } from '@/types';

export const orderService = {
    async checkout(): Promise<Order> {
        try {
            const response = await api.post('/orders/checkout/');
            return response.data;
        } catch (error) {
            console.error('Checkout failed:', error);
            throw error;
        }
    },
    
    async getOrders(): Promise<Order[]> {
        try {
            const response = await api.get('/orders/orders/');
            return response.data;
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            throw error;
        }
    }
};
