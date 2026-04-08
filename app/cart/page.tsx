"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity } from "@/services/cart";
import { CartItem } from "@/types/cart";

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        setCart(getCart());
    }, []);
    const increaseQty = (productId: string) => {
        const updatedCart = cart.map((item) =>
            item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        );

        setCart(updatedCart);
        updateQuantity(productId, updatedCart.find(i => i.productId === productId)!.quantity);
    };

    const decreaseQty = (productId: string) => {
        const updatedCart = cart
            .map((item) =>
                item.productId === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
            .filter((item) => item.quantity > 0); // nếu = 0 thì xoá luôn

        setCart(updatedCart);

        const found = updatedCart.find(i => i.productId === productId);
        if (found) {
            updateQuantity(productId, found.quantity);
        } else {
            removeFromCart(productId);
        }
    };
    return (
        <div className="space-y-6">

            {/* Banner */}
            <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <img
                    src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center px-6">
                    <h1 className="text-white text-2xl font-bold">
                        Your Cart 🛒
                    </h1>
                </div>
            </div>

            {/* container */}
            <div className="bg-white rounded-2xl shadow-lg p-4 items-center space-y-4">
                {cart.length === 0 && (
                    <p className="text-center text-gray-500">Cart is empty</p>
                )}
                {cart.map((p) => (
                    <div
                        key={p.productId}
                        className="flex items-center justify-between bg-gray-100 rounded-xl p-3"
                    >

                        {/* image + name */}
                        <div className="flex items-center gap-3">
                            <img
                                src={p.imageUrl}
                                className="w-16 h-16 object-cover rounded-lg"
                            />

                            <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-sm text-gray-500">
                                    {p.price.toLocaleString()}₫
                                </p>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => decreaseQty(p.productId)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-black hover:text-white transition"
                            >
                                -
                            </button>

                            <span className="w-6 text-center">
                                {p.quantity}
                            </span>

                            <button
                                onClick={() => increaseQty(p.productId)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-black hover:text-white transition"
                            >
                                +
                            </button>
                        </div>

                    </div>
                ))}

            </div>
        </div>
    );
}