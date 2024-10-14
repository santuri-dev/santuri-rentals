import { createContext, ReactNode, useEffect, useState } from 'react';
import { Product } from '@/lib/types';

interface CartContextProps {
	cart: Product[];
	addToCart: (product: Product) => void;
	removeFromCart: (productId: number) => void;
	submitting: number | undefined;
}

export const CartContext = createContext<CartContextProps | undefined>(
	undefined
);

// Fetch cart from localStorage
function fetchCart(): Product[] {
	const cartData = localStorage.getItem('cart');
	return cartData ? JSON.parse(cartData) : [];
}

// Save cart to localStorage
function saveCart(cart: Product[]) {
	localStorage.setItem('cart', JSON.stringify(cart));
}

export default function CartProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState<Product[]>([]);
	const [submitting, setSubmitting] = useState<number | undefined>();

	// Load cart from localStorage on component mount
	useEffect(() => {
		const storedCart = fetchCart();
		setCart(storedCart);
	}, []);

	const addToCart = (product: Product) => {
		setSubmitting(product.id);
		try {
			const updatedCart = [...cart, product];
			setCart(updatedCart);
			saveCart(updatedCart); // Save to localStorage
		} catch (e: unknown) {
			console.error(e);
		}
		setSubmitting(undefined);
	};

	const removeFromCart = (productId: number) => {
		setSubmitting(productId);
		const updatedCart = cart.filter((v) => v.id !== productId);
		setCart(updatedCart);
		saveCart(updatedCart); // Save to localStorage
		setSubmitting(undefined);
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				submitting,
			}}>
			{children}
		</CartContext.Provider>
	);
}
