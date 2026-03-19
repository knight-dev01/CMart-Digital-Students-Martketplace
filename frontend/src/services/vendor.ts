import api from './api';

export const vendorService = {
    applyAsVendor: async (data: any) => {
        try {
            const response = await api.post('/vendors/apply/', data);
            return response.data;
        } catch (error) {
            console.error('Error applying as vendor:', error);
            throw error;
        }
    },

    getShops: async () => {
        try {
            const response = await api.get('/vendors/shops/');
            return response.data;
        } catch (error) {
            console.error('Error fetching shops:', error);
            return [];
        }
    },

    getShopBySlug: async (slug: string) => {
        try {
            const response = await api.get(`/vendors/shops/${slug}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching shop:', error);
            throw error;
        }
    },

    updateShop: async (slug: string, data: any) => {
        try {
            const response = await api.patch(`/vendors/shops/${slug}/`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating shop:', error);
            throw error;
        }
    }
};
