'use client'

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { getCart } from "@/services/cart.service"

export default function Navbar() {
  const [count, setCount] = useState(0)

  const loadCart = () => {
    const cart = getCart()
    const total = cart.reduce((sum, item) => sum + item.quantity, 0)
    setCount(total)
  }

  useEffect(() => {
    loadCart()

    // update khi localStorage thay đổi (multi tab)
    window.addEventListener("storage", loadCart)
    window.addEventListener("cartUpdated", loadCart)

    return () => {
      window.removeEventListener("storage", loadCart)
      window.removeEventListener("cartUpdated", loadCart)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4">

        {/* LOGO */}
        <Link href="/" className="font-bold text-xl tracking-wide">
          POSY
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/" className="font-medium hover:opacity-80 transition">
            Menu
          </Link>

          <Link href="/orders" className="font-medium hover:opacity-80 transition">
            My Order
          </Link>

          {/* CART */}
          <Link href="/cart" className="relative">
            <ShoppingCart size={22} />

            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full text-white">
                {count}
              </span>
            )}
          </Link>

        </div>
      </div>
    </div>
  )
}