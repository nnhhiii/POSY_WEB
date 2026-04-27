"use client";

import ProductCard from "@/components/product/ProductCard"
import { useSnackbar } from "@/components/SnackbarContext";
import { apiService } from "@/services/api.service";
import { Category, Product } from "@/types/product"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Home() {
  const searchParams = useSearchParams();

  const tableId = searchParams.get("tableId");
  const token = searchParams.get("token");
  const [sessionReady, setSessionReady] = useState(false);

  const { showMessage } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const initSession = async () => {
      if (tableId && token) {
        try {
          await apiService.startSession(tableId, token);
          showMessage("Quét QR thành công!", "success");

          // Xóa query trên URL cho sạch
          window.history.replaceState({}, document.title, "/");

        } catch (err: any) {
          console.error(err);
          showMessage("Không thể tạo session", "error");
        }
      }
      setSessionReady(true);
    };

    initSession();
  }, [tableId, token]);

  const fetchProducts = async (q?: string) => {
    setLoading(true);
    try {
      const res = await apiService.getProducts(q);
      setProducts(res.data.items);
    } catch (err: any) {
      console.error(err);

      if (err?.response?.data?.message) {
        showMessage(err.response.data.message, 'error');
      } else {
        showMessage('Something went wrong', 'error');
      }
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiService.getCategories();
      setCategories(res.data.items);
    } catch (err: any) {
      console.error(err);

      if (err?.response?.data?.message) {
        showMessage(err.response.data.message, 'error');
      } else {
        showMessage('Something went wrong', 'error');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!sessionReady) return;

    fetchProducts();
    fetchCategories();
  }, [sessionReady]);

  return (
    <div className="space-y-6">

      {/* Banner */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center px-6">
          <h1 className="text-white text-3xl font-bold">
            Delicious Food 🍔
          </h1>
        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchProducts(search);
        }}
        className="flex gap-2">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3554C1]"
        />
        <button type="submit" className="px-4 py-2 bg-[#3554C1] text-white rounded-xl hover:bg-[#2a439c] transition cursor-pointer">
          Search
        </button>
      </form>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Đang tải...
          </p>
        </div>
      ) : (
        <>
          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                className="px-4 py-2 rounded-full bg-white hover:bg-[#3554C1] hover:text-white whitespace-nowrap transition cursor-pointer"
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>

      )}
    </div>

  )
}