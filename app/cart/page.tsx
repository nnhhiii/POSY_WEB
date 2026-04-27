"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateQuantity } from "@/services/cart.service";
import { CartItem } from "@/types/cart";
import { apiService } from "@/services/api.service";
import { useSnackbar } from "@/components/SnackbarContext";

export default function CartPage() {
    const { showMessage } = useSnackbar();
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

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    const handleCheckout = async () => {
        if (cart.length === 0) {
            showMessage("Cart is empty", "error");
            return
        }

        try {
            const payload = cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                note: null,
            }))

            const res = await apiService.createOrder(payload)

            showMessage("Order placed successfully", "success");

            // clear cart
            setCart([])
            localStorage.removeItem("cart")

            console.log(res.data)
        } catch (e: any) {
            console.error(e)
            if (e?.response?.data?.message) {
                showMessage(e.response.data.message, "error");
            } else {
                showMessage("Something went wrong", "error");
            }
        }
    }
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

            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                        {subtotal.toLocaleString()}₫
                    </span>
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full mt-3 bg-[#3554C1] text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                >
                    Đặt món
                </button>
            </div>
        </div>
    );
}