"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import { useRouter } from "next/navigation";
import { getSocket } from "@/services/socket.service";
import { useSnackbar } from "@/components/SnackbarContext";
import { getStatusClass, getStatusLabel } from "@/utils/orderStatus";

export default function OrderDetailPage() {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { showMessage } = useSnackbar();
    const router = useRouter();

    const fetchOrder = async () => {
        try {
            const res = await apiService.getOrder();
            setOrder(res.data);
        } catch (err: any) {
            console.error(err);
            showMessage("Không lấy được order", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrder();
    }, []);

    useEffect(() => {
        const socket = getSocket();

        socket.on("order:updated", async (data) => {
            console.log("Realtime update:", data);

            await fetchOrder();
        });

        socket.on("order:created", async (data) => {
            console.log("Order created:", data);

            await fetchOrder();
        });

        return () => {
            socket.off("order:updated");
            socket.off("order:created");
        };
    }, []);

    if (loading) {
        return <div className="h-64 flex items-center justify-center">Loading...</div>;
    }

    if (!order) {
        return <div className="text-center">Không có order</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">

            {/* Header */}
            <div className="bg-white p-5 rounded-2xl shadow">
                <h2 className="text-xl font-bold">Order #{order.id}</h2>
                <p className="text-sm text-gray-500">Bàn: {order.table?.name}</p>
                <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                </p>

                {/* Status */}
                <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${getStatusClass(order.status)}`}
                >
                    {getStatusLabel(order.status)}
                </span>
            </div>

            {/* Items */}
            <div className="bg-white p-5 rounded-2xl shadow space-y-4">
                <h3 className="font-semibold text-lg">Món đã gọi</h3>

                {order.orderItems.map((item: any) => (
                    <div
                        key={item.id}
                        className="flex gap-4 p-3 border border-gray-200 rounded-xl"
                    >
                        <img
                            src={item.product.imageUrl}
                            className="w-20 h-20 object-cover rounded-xl"
                        />

                        <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>

                            <p className="text-sm text-gray-500 mt-1">
                                Quantity: {item.quantity}
                            </p>

                            <p className="text-sm text-gray-500 italic">
                                Note: {item.note || "—"}
                            </p>

                            {/* Status */}
                            <span
                                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${getStatusClass(item.status)}`}
                            >
                                {getStatusLabel(item.status)}
                            </span>
                        </div>

                        <p className="font-semibold">
                            {item.subtotal.toLocaleString()}đ
                        </p>
                    </div>
                ))}
            </div>

             {/* Total */}
            <div className="bg-white p-5 rounded-2xl shadow space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính</span>
                    <span>{order.subtotalAmount.toLocaleString()}đ</span>
                </div>

                {/* DIVIDER */}
                <div className="border-t border-gray-300"></div>

                <div className="flex justify-between text-lg font-bold">
                    <span>Tổng tiền</span>
                    <span className="text-blue-600">
                        {order.totalAmount.toLocaleString()}đ
                    </span>
                </div>
            </div>

            {/* Edit button */}
            <button
                onClick={() => router.push("/orders/edit")}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
                Chỉnh sửa đơn
            </button>
        </div>
    );
}