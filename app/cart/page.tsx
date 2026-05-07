"use client";

import { useEffect, useState } from "react";
import { clearCart, getCart, removeFromCart, updateNote, updateQuantity } from "@/services/cart.service";
import { CartItem, CreateOrderItem } from "@/types/cart";
import { apiService } from "@/services/api.service";
import { useSnackbar } from "@/components/SnackbarContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const { showMessage } = useSnackbar();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orderNote, setOrderNote] = useState("");

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

    const handleNoteChange = (productId: string, note: string) => {
        const updatedCart = cart.map((item) =>
            item.productId === productId
                ? { ...item, note }
                : item
        );

        setCart(updatedCart);

        // lưu localStorage
        updateNote(productId, note)
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
            const payload: CreateOrderItem[] = cart.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                note: item.note || null,
            }))

            const res = await apiService.createOrder({
                items: payload,
                note: orderNote || null,
            });

            showMessage("Order placed successfully", "success");

            // clear cart
            setCart([])
            clearCart()

            router.push(`/orders`);
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
                        Giỏ hàng
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
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-100 rounded-xl p-3"
                    >

                        {/* Info */}
                        <div className="flex items-start gap-3 w-full">
                            <img
                                src={p.imageUrl}
                                className="w-16 h-16 object-cover rounded-lg"
                            />

                            <div className="flex-1">
                                <p className="font-medium">{p.name}</p>
                                <p className="text-sm text-gray-500">
                                    {p.price.toLocaleString()}₫
                                </p>

                                {/* Quantity (mobile) */}
                                <div className="flex items-center gap-2 mt-2 sm:hidden">
                                    <button
                                        onClick={() => decreaseQty(p.productId)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-black hover:text-white transition cursor-pointer"
                                    >
                                        -
                                    </button>

                                    <span className="w-6 text-center">{p.quantity}</span>

                                    <button
                                        onClick={() => increaseQty(p.productId)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow  hover:bg-black hover:text-white transition cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>

                                <textarea
                                    placeholder="Ghi chú..."
                                    value={p.note || ""}
                                    onChange={(e) => handleNoteChange(p.productId, e.target.value)}
                                    className="w-full mt-2 p-3 border border-gray-400 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                                />
                            </div>
                        </div>

                        {/* Quantity (desktop) */}
                        <div className="hidden sm:flex items-center gap-2 ml-3">
                            <button
                                onClick={() => decreaseQty(p.productId)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-black hover:text-white transition cursor-pointer"
                            >
                                -
                            </button>

                            <span className="w-6 text-center">{p.quantity}</span>

                            <button
                                onClick={() => increaseQty(p.productId)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-black hover:text-white transition cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}

            </div>

            <div className="mt-6 bg-white rounded-2xl shadow-lg p-5 space-y-4">

                {/* NOTE */}
                <div>
                    <label className="text-sm font-medium text-gray-700">
                        Ghi chú cho toàn đơn
                    </label>
                    <textarea
                        placeholder="Ví dụ: Không hành, ít cay..."
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        className="w-full mt-2 p-3 border border-gray-200 rounded-xl text-sm 
                 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
                 outline-none transition resize-none"
                        rows={3}
                    />
                </div>

                {/* DIVIDER */}
                <div className="border-t"></div>

                {/* SUBTOTAL */}
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="text-lg font-bold text-gray-900">
                        {subtotal.toLocaleString()}₫
                    </span>
                </div>

                {/* BUTTON */}
                <button
                    onClick={handleCheckout}
                    className="w-full mt-2 bg-gradient-to-r bg-[#3554C1] 
               text-white py-3 rounded-xl font-semibold 
               shadow-md hover:shadow-lg hover:scale-[1.02] 
               active:scale-95 transition-all duration-200 cursor-pointer"
                >
                    Đặt món
                </button>

            </div>
        </div>
    );
}