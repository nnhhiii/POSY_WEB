"use client"

import api, { apiService } from "@/services/api.service"
import { addToCart } from "@/services/cart.service"
import { Product } from "@/types/product"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useSnackbar } from "../SnackbarContext"

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { showMessage } = useSnackbar();
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<Product | null>(null)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
    showMessage('Added to cart', 'success')
  }

  const handleOpen = async () => {
    setOpen(true)
    setLoading(true)

    try {
      const res = await apiService.getProductById(product.id)
      setDetail(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={handleOpen} className="flex p-4 rounded-xl bg-white shadow-sm hover:shadow-2xl transition cursor-pointer">
      <div className="flex flex-col flex-1 justify-between py-3 px-2">
        <div>
          <h2 className="font-semibold">{product.name}</h2>
          <p className="text-xs text-gray-500 mt-1 line-clamp-3">
            {product.category?.name}
          </p>
        </div>

        <p className="text-red-500 font-bold">
          {product.price.toLocaleString()}₫
        </p>
      </div>
      <div className="relative w-[140px] h-[140px]">
        <img
          src={product.imageUrl || "https://picsum.photos/200"}
          className="w-full h-full object-cover rounded-xl"
        />
        <button
          onClick={handleAdd}
          className="absolute -bottom-1 -right-1 bg-white/80 p-4 rounded-tl-4xl hover:scale-110 transition"
        >
          <div className="bg-[#3554C1] p-1.5 rounded-full flex items-center justify-center">
            <Plus size={16} className="text-white" />
          </div>
        </button>
      </div>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-[400px] max-w-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <p>Loading...</p>
            ) : detail ? (
              <>
                <img
                  src={detail.imageUrl || "https://picsum.photos/300"}
                  className="w-full h-[200px] object-cover rounded-xl mb-4"
                />

                <h2 className="text-lg font-semibold">{detail.name}</h2>

                <p className="text-sm text-gray-500 mt-2">
                  {detail.description}
                </p>

                {/* CATEGORY */}
                <p className="text-xs text-gray-400 mt-1">
                  {detail.category?.name}
                </p>

                {/* PRICE */}
                <p className="text-red-500 font-bold mt-4">
                  {detail.price.toLocaleString()}₫
                </p>

                {/* EXTRA ATTRIBUTES */}
                {detail.attributes && (
                  <div className="mt-4 text-sm text-gray-600 space-y-1">
                    <p>🍽 Cuisine: {detail.attributes.cuisine?.name}</p>
                    <p>⏱ Prep: {detail.attributes.preparationTime} phút</p>
                    <p>🌶 Spice: {detail.attributes.spiceLevel}</p>
                    <p>
                      🥗 Tags: {detail.attributes.dietaryTags?.join(", ")}
                    </p>
                  </div>
                )}

                <button
                  onClick={(e) => {
                    handleAdd(e)
                  }}
                  className="mt-4 w-full bg-[#3554C1] text-white py-2 rounded-lg"
                >
                  Add to cart
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="mt-2 w-full bg-gray-200 py-2 rounded-lg"
                >
                  Close
                </button>
              </>
            ) : (
              <p>Không có dữ liệu</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}