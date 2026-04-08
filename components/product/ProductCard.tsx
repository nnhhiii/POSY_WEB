"use client"

import { addToCart } from "@/services/cart"
import { Product } from "@/types/product"
import { Plus } from "lucide-react"

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {

  const handleAdd = () => {
    addToCart(product)
    alert("Added to cart")
  }

  return (
    <div className="flex p-4 rounded-xl bg-white shadow-sm hover:shadow-2xl transition">
      <div className="flex flex-col flex-1 justify-between py-3 px-2">
        <div>
          <h2 className="font-semibold">{product.name}</h2>
          <p className="text-xs text-gray-500 mt-1 line-clamp-3">
            {product.description}
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
    </div>
  )
}