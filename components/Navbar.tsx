import Link from "next/link"
import { ShoppingCart } from "lucide-react"

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between px-4">
        
        {/* LOGO */}
        <Link href="/" className="font-bold text-xl tracking-wide">
          POSY
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="font-medium hover:opacity-80 transition"
          >
            Menu
          </Link>

          <Link
            href="/orders"
            className="font-medium hover:opacity-80 transition"
          >
            My Order
          </Link>

          {/* CART ICON */}
          <Link
            href="/cart"
            className="relative"
          >
            <ShoppingCart size={22} />

            {/* Badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              2
            </span>
          </Link>

        </div>
      </div>
    </div>
  )
}