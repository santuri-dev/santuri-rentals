import {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { Product } from '@/lib/types';

interface CartItem {
	product: Product;
	quantity: number;
}

interface CartContextProps {
	cart: CartItem[];
	addToCart: (product: Product) => void;
	removeFromCart: (productId: number) => void;
	submitting: number | undefined;
	subtotal: number; // New subtotal value
	clearCart: () => void;
}

export const CartContext = createContext<CartContextProps | undefined>(
	undefined
);

// Fetch cart from localStorage
function fetchCart(): CartItem[] {
	const cartData = localStorage.getItem('cart');
	return cartData ? JSON.parse(cartData) : [];
}

// Save cart to localStorage
function saveCart(cart: CartItem[]) {
	localStorage.setItem('cart', JSON.stringify(cart));
}

export default function CartProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [submitting, setSubmitting] = useState<number | undefined>();
	const [subtotal, setSubtotal] = useState<number>(0); // State for subtotal

	// Calculate subtotal whenever the cart changes
	useEffect(() => {
		const total = cart.reduce(
			(acc, item) => acc + item.product.price * item.quantity,
			0
		);
		setSubtotal(total);
	}, [cart]);

	// Load cart from localStorage on component mount
	useEffect(() => {
		const storedCart = fetchCart();
		setCart(storedCart);
	}, []);

	const clearCart = useCallback(() => {
		setCart([]);
		saveCart([]);
	}, []);

	const addToCart = useCallback(
		(product: Product) => {
			setSubmitting(product.id);
			try {
				const existingItem = cart.find(
					(item) => item.product.id === product.id
				);
				let updatedCart;

				if (existingItem) {
					// If the product already exists, increase its quantity
					updatedCart = cart.map((item) =>
						item.product.id === product.id
							? { ...item, quantity: item.quantity + 1 }
							: item
					);
				} else {
					// If the product is not in the cart, add it with quantity 1
					updatedCart = [...cart, { product, quantity: 1 }];
				}

				setCart(updatedCart);
				saveCart(updatedCart); // Save to localStorage
			} catch (e: unknown) {
				console.error(e);
			}
			setSubmitting(undefined);
		},
		[cart]
	);

	const removeFromCart = useCallback(
		(productId: number) => {
			setSubmitting(productId);
			const existingItem = cart.find((item) => item.product.id === productId);
			let updatedCart;

			if (existingItem && existingItem.quantity > 1) {
				// If the product exists and its quantity is greater than 1, reduce the quantity
				updatedCart = cart.map((item) =>
					item.product.id === productId
						? { ...item, quantity: item.quantity - 1 }
						: item
				);
			} else {
				// If the quantity is 1 or the product does not exist, remove the item
				updatedCart = cart.filter((item) => item.product.id !== productId);
			}

			setCart(updatedCart);
			saveCart(updatedCart); // Save to localStorage
			setSubmitting(undefined);
		},
		[cart]
	);

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				submitting,
				subtotal,
				clearCart,
			}}>
			{children}
		</CartContext.Provider>
	);
}
