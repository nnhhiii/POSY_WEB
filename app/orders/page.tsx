"use client";

import { useEffect, useState } from "react";
import { apiService } from "@/services/api.service";
import { useSnackbar } from "@/components/SnackbarContext";
import { getSocket } from "@/services/socket.service";

export default function OrdersPage() {
    const { showMessage } = useSnackbar();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<any[]>([]);

    const [changes, setChanges] = useState({
        add: [] as any[],
        update: [] as any[],
        remove: [] as any[],
        note: "",
    });

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

    useEffect(() => {
        fetchOrder();
    }, []);

    useEffect(() => {
        if (order?.orderItems) {
            setItems(order.orderItems);
        }
    }, [order]);

    const handleUpdateQty = (itemId: string, quantity: number) => {
        if (quantity <= 0) return;

        // update UI
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        quantity,
                        subtotal: quantity * item.unitPrice,
                    }
                    : item
            )
        );

        // merge update
        setChanges((prev) => {
            const existing = prev.update.find((i) => i.orderItemId === itemId);

            if (existing) {
                return {
                    ...prev,
                    update: prev.update.map((i) =>
                        i.orderItemId === itemId
                            ? { ...i, quantity }
                            : i
                    ),
                };
            }

            return {
                ...prev,
                update: [
                    ...prev.update,
                    { orderItemId: itemId, quantity },
                ],
            };
        });
    };

    const handleRemove = (itemId: string) => {
        // update UI
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, status: "CANCELLED" }
                    : item
            )
        );

        // lưu vào changes để gửi API sau
        setChanges((prev) => ({
            ...prev,
            remove: [...prev.remove, { orderItemId: itemId }],
        }));
    };

    const handleAdd = (product: any) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.product.id === product.id);

            // Nếu đã có → tăng quantity
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                            subtotal: (item.quantity + 1) * item.unitPrice,
                        }
                        : item
                );
            }

            // Nếu chưa có → thêm mới
            return [
                ...prev,
                {
                    id: "temp-" + Date.now(), // fake id
                    quantity: 1,
                    unitPrice: product.price,
                    subtotal: product.price,
                    status: "PENDING",
                    product: {
                        id: product.id,
                        name: product.name,
                        imageUrl: product.imageUrl,
                    },
                },
            ];
        });

        // lưu vào changes
        setChanges((prev) => ({
            ...prev,
            add: [
                ...prev.add,
                {
                    productId: product.id,
                    quantity: 1,
                },
            ],
        }));
    };

    const handleUpdateNote = (itemId: string, note: string) => {
        // update UI
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, note }
                    : item
            )
        );

        // lưu change
        setChanges((prev) => {
            const existing = prev.update.find((i) => i.orderItemId === itemId);

            if (existing) {
                return {
                    ...prev,
                    update: prev.update.map((i) =>
                        i.orderItemId === itemId
                            ? { ...i, note }
                            : i
                    ),
                };
            }

            return {
                ...prev,
                update: [
                    ...prev.update,
                    { orderItemId: itemId, note },
                ],
            };
        });
    };

    const handleSubmit = async () => {
        try {
            await apiService.updateOrder(changes);
            showMessage("Cập nhật thành công", "success");
            setChanges({ add: [], update: [], remove: [], note: "" });
            fetchOrder();
        } catch (e) {
            showMessage("Cập nhật thất bại", "error");
        }
    };


    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!order) {
        return <div className="text-center">Không có order</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-10">

            {/* Header */}
            <div className="bg-white p-5 rounded-2xl shadow">
                <h2 className="text-xl font-bold mb-1">Order #{order.id}</h2>
                <p className="text-sm text-gray-500">Bàn: {order.table?.name}</p>
                <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                </p>

                <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-medium">
                    {order.status}
                </span>
            </div>

            {/* Items */}
            <div className="bg-white p-5 rounded-2xl shadow space-y-4">
                <h3 className="font-semibold text-lg">Món đã gọi</h3>

                {items.length === 0 && (
                    <p className="text-gray-400 text-sm">Chưa có món</p>
                )}

                {items.map((item: any) => (
                    <div
                        key={item.id}
                        className={`flex gap-4 p-3 rounded-xl border transition ${item.status === "CANCELLED" ? "opacity-50 bg-gray-50" : ""
                            }`}
                    >
                        {/* Image */}
                        <img
                            src={item.product.imageUrl}
                            className="w-20 h-20 object-cover rounded-xl"
                        />

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <p className="font-medium">{item.product.name}</p>
                                {/* Status */}
                                <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-600 font-medium">
                                    {item.status}
                                </span>

                                {/* Quantity */}
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        disabled={item.status === "CANCELLED"}
                                        onClick={() =>
                                            handleUpdateQty(item.id, item.quantity - 1)
                                        }
                                        className="px-2 py-1 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
                                    >
                                        -
                                    </button>

                                    <span className="min-w-[20px] text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        disabled={item.status === "CANCELLED"}
                                        onClick={() =>
                                            handleUpdateQty(item.id, item.quantity + 1)
                                        }
                                        className="px-2 py-1 bg-gray-200 rounded-lg disabled:opacity-50 cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Note */}
                                <textarea
                                    placeholder="Ghi chú món..."
                                    value={item.note || ""}
                                    onChange={(e) =>
                                        handleUpdateNote(item.id, e.target.value)
                                    }
                                    className="w-full mt-2 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    disabled={item.status === "CANCELLED"}
                                />
                            </div>
                        </div>

                        {/* Price + action */}
                        <div className="flex flex-col justify-between items-end">
                            <p className="font-semibold text-right">
                                {item.subtotal.toLocaleString()}đ
                            </p>

                            {item.status === "CANCELLED" && (
                                <span className="text-red-500 text-xs font-semibold ml-2">
                                    Đã hủy
                                </span>
                            )}

                            {item.status === "WAITING" && (
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-red-500 text-sm hover:underline cursor-pointer"
                                >
                                    Hủy món
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Order note */}
                <textarea
                    placeholder="Ghi chú cho toàn đơn..."
                    value={changes.note}
                    onChange={(e) =>
                        setChanges((prev) => ({ ...prev, note: e.target.value }))
                    }
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                />
            </div>

            {/* Total */}
            <div className="bg-white p-5 rounded-2xl shadow space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Tạm tính</span>
                    <span>{order.subtotalAmount.toLocaleString()}đ</span>
                </div>

                <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">
                        {order.totalAmount.toLocaleString()}đ
                    </span>
                </div>
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
                Cập nhật đơn
            </button>

            {/* Recommendations */}
            <div className="bg-white p-5 rounded-2xl shadow">
                <h3 className="font-semibold mb-4">Gợi ý cho bạn</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {order.recommendations?.map((r: any) => (
                        <div
                            key={r.id}
                            className="border rounded-xl p-3 hover:shadow transition"
                        >
                            <img
                                src={r.imageUrl}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            <p className="font-medium text-sm mt-2">{r.name}</p>
                            <p className="text-sm text-gray-500">
                                {r.price.toLocaleString()}đ
                            </p>

                            <button
                                onClick={() => handleAdd(r)}
                                className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-1 rounded-lg text-sm transition"
                            >
                                Thêm
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}