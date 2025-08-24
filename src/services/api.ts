import { type LoginCredentials, type User, type ProductsResponse, type Product, type Cart } from '../types/api';

const API_BASE = 'https://dummyjson.com';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error('Invalid credentials');
    }
    
    return response.json();
  },

  getMe: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    return response.json();
  },
};

export const productsApi = {
  getProducts: async (skip = 0, limit = 20): Promise<ProductsResponse> => {
    const response = await fetch(`${API_BASE}/products?limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return response.json();
  },

  searchProducts: async (query: string, skip = 0, limit = 20): Promise<ProductsResponse> => {
    const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
    
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    
    return response.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    return response.json();
  },
};

export const cartApi = {
  getUserCart: async (userId: number): Promise<Cart> => {
    const response = await fetch(`${API_BASE}/carts/user/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch cart');
    }
    
    const data = await response.json();
    return data.carts[0] || { id: 0, products: [], total: 0, discountedTotal: 0, userId, totalProducts: 0, totalQuantity: 0 };
  },

  addToCart: async (userId: number, products: { id: number; quantity: number }[]): Promise<Cart> => {
    const response = await fetch(`${API_BASE}/carts/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, products }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }
    
    return response.json();
  },
};
