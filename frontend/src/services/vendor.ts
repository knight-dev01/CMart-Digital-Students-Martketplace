import api from './api';
import { Shop, VendorProfile } from '@/types';

export const vendorService = {
    applyAsVendor: async (data: Partial<VendorProfile>): Promise<VendorProfile> => {
        try {
            const response = await api.post('/vendors/apply/', data);
            return response.data;
        } catch (error) {
            console.error('Error applying as vendor:', error);
            throw error;
        }
    },

    getShops: async (): Promise<Shop[]> => {
        try {
            const response = await api.get('/vendors/shops/');
            return response.data;
        } catch (error) {
            console.error('Error fetching shops:', error);
            return [];
        }
    },

    getShopBySlug: async (slug: string): Promise<Shop> => {
        try {
            const response = await api.get(`/vendors/shops/${slug}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shop:', error);
            throw error;
        }
    },

    updateShop: async (slug: string, data: Partial<Shop>): Promise<Shop> => {
        try {
            const response = await api.patch(`/vendors/shops/${slug}/`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating shop:', error);
            throw error;
        }
    }
};
