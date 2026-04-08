"use client";

import ProductCard from "@/components/product/ProductCard"
import { Product } from "@/types/product"
import { useState } from "react";


export default function Home() {
  const [search, setSearch] = useState("");

  const products: Product[] = [
    {
      id: "1",
      sku: "BEEF01",
      name: "Beef Burger",
      description: '1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
      price: 120000,
      imageUrl: "https://picsum.photos/200",
      stockQuantity: 100,
      isAvailable: true,
      isDeleted: false,
      category: { id: "1", name: "Burger" },
    },
    {
      id: "2",
      sku: "CHK01",
      name: "Fried Chicken",
      description: '1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
      price: 90000,
      imageUrl: "https://picsum.photos/201",
      stockQuantity: 100,
      isAvailable: true,
      isDeleted: false,
      category: { id: "2", name: "Chicken" },
    },
    {
      id: "3",
      sku: "COF01",
      name: "Coffee",
      description: '1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
      price: 30000,
      imageUrl: "https://picsum.photos/202",
      stockQuantity: 100,
      isAvailable: true,
      isDeleted: false,
      category: { id: "3", name: "Drink" },
    },
    {
      id: "4",
      sku: "COF02",
      name: "Coffee 2",
      description: '1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
      price: 30000,
      imageUrl: "https://picsum.photos/203",
      stockQuantity: 100,
      isAvailable: true,
      isDeleted: false,
      category: { id: "4", name: "Drink" },
    },
    {
      id: "5",
      sku: "COF03",
      name: "Coffee 3",
      description: '1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
      price: 30000,
      imageUrl: "https://picsum.photos/204",
      stockQuantity: 100,
      isAvailable: true,
      isDeleted: false,
      category: { id: "5", name: "Drink" },
    },
    {
      id: "6",
      sku: "COF04",
      name: "Coffee 4",
      description: '1 McChicken™, 1 Big Mac™,  1 Royal Cheeseburger, 3 medium sized French Fries , 3 cold drinks',
      price: 30000,
      imageUrl: "https://picsum.photos/205",
      stockQuantity: 100,
      isAvailable: true,
      isDeleted: false,
      category: { id: "6", name: "Drink" },
    },
  ]

  const categories = [
    { id: "1", name: "All" },
    { id: "2", name: "Burger" },
    { id: "3", name: "Pizza" },
    { id: "4", name: "Drink" },
    { id: "5", name: "Dessert" },
  ];
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
      <input
        type="text"
        placeholder="Search food..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3554C1]"
      />

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            className="px-4 py-2 rounded-full bg-white hover:bg-[#3554C1] hover:text-white whitespace-nowrap transition"
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

    </div>

  )
}