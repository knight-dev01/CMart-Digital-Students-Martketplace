import api from './api';

export const productService = {
  getProducts: async () => {
    try {
      const response = await api.get('/products/');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },
  
  getCategories: async () => {
    try {
      const response = await api.get('/products/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
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
      console.error('Error fetching shop by slug:', error);
      throw error;
    }
  },

  getProductsByShop: async (shopSlug: string) => {
    try {
      const response = await api.get('/products/', {
        params: { shop_slug: shopSlug }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products by shop:', error);
      return [];
    }
  },
  
  createProduct: async (productData: any, images?: File[]) => {
    try {
      if (images && images.length > 0) {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
          formData.append(key, productData[key]);
        });
        images.forEach(image => {
          formData.append('images', image);
        });
        
        const response = await api.post('/products/create/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
      } else {
        const response = await api.post('/products/create/', productData);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  getProductById: async (id: string | number) => {
    try {
      const response = await api.get(`/products/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product by id:', error);
      throw error;
    }
  },

  likeProduct: async (id: string | number) => {
    try {
      const response = await api.post(`/products/${id}/like/`);
      return response.data;
    } catch (error) {
      console.error('Error liking product:', error);
      throw error;
    }
  }
};
