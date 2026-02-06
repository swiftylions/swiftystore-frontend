import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  selectCartItems,
} from "../store/cart-slice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function CartTable() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartItems);

  const subTotal = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const updateCartQuantity = (productId, quantity) => {
    const product = cart.find((item) => item.productId === productId);
    dispatch(
      addToCart({ product, quantity: quantity - (product?.quantity || 0) })
    );
  };

  const handleIncrement = (item) => {
    updateCartQuantity(item.productId, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.productId, item.quantity - 1);
    }
  };

  return (
    <div className="min-h-80 max-w-4xl mx-auto my-8 w-full font-primary">
      <table className="w-full">
        <thead>
          <tr className="uppercase text-sm text-primary dark:text-light border-b border-primary dark:border-light">
            <th className="px-6 py-4">Product</th>
            <th className="px-6 py-4">Quantity</th>
            <th className="px-6 py-4">Price</th>
            <th className="px-6 py-4">Remove</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary dark:divide-light">
          {cart.map((item) => (
            <tr
              key={item.productId}
              className="text-sm sm:text-base text-primary dark:text-light text-center"
            >
              <td className="px-4 sm:px-6 py-4 flex items-center">
                <Link
                  to={`/products/${item.productId}`}
                  state={{ product: item }}
                  className="flex items-center"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-full shadow-l object-cover mr-4 hover:scale-110 transition-transform"
                  />
                  <span className="text-primary dark:text-light hover:underline">
                    {item.name}
                  </span>
                </Link>
              </td>
              <td className="px-4 sm:px-6 py-4 space-x-2">
                <button
                  type="button"
                  onClick={() => handleDecrement(item)}
                  className="w-7 h-7 cursor-pointer hidden sm:inline items-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 xl:shadow-m xl:dark:shadow-l"
                >
                  -
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  value={item.quantity}
                  onChange={(e) =>
                    updateCartQuantity(
                      item.productId,
                      parseInt(e.target.value, 10) || 1
                    )
                  }
                  className="w-13 px-2 py-1 rounded-2xl xl:shadow-depth-m xl:dark:shadow-depth-l transition ease-in duration-100 backdrop-blur-lg bg-white dark:bg-gray-900 xl:bg-transparent xl:dark:bg-transparent xl:backdrop-brightness-120 xl:dark:backdrop-brightness-70 shadow-sm focus:shadow-l dark:focus:shadow-l dark:focus:shadow-gray-600 focus:outline-none text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={() => handleIncrement(item)}
                  className="w-7 h-7 cursor-pointer hidden sm:inline items-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 xl:shadow-m xl:dark:shadow-l"
                >
                  +
                </button>
              </td>
              <td className="px-4 sm:px-6 py-4 text-base font-light">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-4 sm:px-6 py-4">
                <button
                  aria-label="delete-item"
                  onClick={() =>
                    dispatch(removeFromCart({ productId: item.productId }))
                  }
                  className="text-primary cursor-pointer dark:text-red-400 rounded-full border border-primary xl:shadow-l xl:border-none dark:border-red-400 pt-2 pr-3 pl-3 pb-1 hover:bg-lighter dark:hover:bg-gray-700"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </td>
            </tr>
          ))}
          {cart.length > 0 && (
            <tr className="text-center">
              <td></td>
              <td className="text-base text-gray-600 dark:text-gray-300 font-semibold uppercase px-4 sm:px-6 py-4">
                Subtotal
              </td>
              <td className="text-lg text-primary dark:text-blue-400 font-medium px-4 sm:px-6 py-4">
                ${subTotal}
              </td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
