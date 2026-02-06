import React from "react";
import { useCart } from "../store/cart-context";

export default function QuantityInput({ productId, quantity }) {
  const { cart, addToCart } = useCart();

  // بروزرسانی مقدار امن
  const updateQuantity = (newQuantity) => {
    const safeQuantity = Math.max(1, newQuantity || 1);
    const product = cart.find((item) => item.productId === productId);
    if (!product) return;
    addToCart(product, safeQuantity - product.quantity);
  };

  const increment = () => updateQuantity(quantity + 1);
  const decrement = () => updateQuantity(quantity - 1);

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    updateQuantity(value);
  };

  const handleKeyDown = (e) => {
    // جلوگیری از ورود e/E/+/-
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  return (
    <div className="space-x-2">
      <button
        type="button"
        onClick={decrement}
        className="w-7 h-7 items-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 xl:shadow-m xl:dark:shadow-l"
      >
        -
      </button>

      <input
        type="number"
        inputMode="numeric"
        value={quantity}
        min={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-16 text-center px-2 py-1 rounded-2xl shadow-sm focus:outline-none focus:shadow-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 xl:shadow-depth-m xl:dark:shadow-depth-l transition ease-in duration-100 backdrop-blur-lg xl:bg-transparent xl:dark:bg-transparent xl:backdrop-brightness-120 xl:dark:backdrop-brightness-70"
      />

      <button
        type="button"
        onClick={increment}
        className="w-7 h-7 items-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 xl:shadow-m xl:dark:shadow-l"
      >
        +
      </button>
    </div>
  );
}
