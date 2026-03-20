'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useLoading } from './LoadingContext';

export interface CartItem {
    id: number;
    name: string;
    price: number | string;
    image: string;
    shop_name: string;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { user } = useAuth();
    const { setIsLoading } = useLoading();

    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem('cmart_cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) {
                    setCartItems(parsed);
                }
            } catch (e) {
                console.error('Failed to parse cart');
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cmart_cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialized]);

    const addToCart = (product: any) => {
        // Only block if logged in as a non-buyer
        if (user && user.role === 'VENDOR') {
            return;
        }

        const productId = Number(product.id);
        if (isNaN(productId)) {
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setCartItems(prev => {
                const existing = prev.find(item => Number(item.id) === productId);
                if (existing) {
                    return prev.map(item =>
                        Number(item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
                    );
                }

                const newProduct: CartItem = {
                    id: productId,
                    name: product.name || 'Unknown Product',
                    price: product.price || 0,
                    image: product.image || product.images?.[0]?.image || 'https://via.placeholder.com/300?text=Product',
                    shop_name: product.shop_name || 'Campus Vendor',
                    quantity: 1
                };
                return [...prev, newProduct];
            });
            setIsLoading(false);
        }, 500); // Brief feedback for the user
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setCartItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cart: cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
