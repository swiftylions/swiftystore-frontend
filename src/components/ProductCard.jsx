import React from "react";
import Price from "./Price";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/auth-slice";
import { addToCart } from "../store/cart-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");
  return (
    <div className="w-72 rounded-3xl mx-auto shadow-l overflow-hidden flex flex-col bg-white dark:bg-cyan-950 dark:shadow-gray-700 hover:shadow-l hover:shadow-gray-400 dark:hover:shadow-gray-600 hover:border-gray-400 dark:hover:border-light hover:scale-103 transition ease-in">
      <Link
        to={`/products/${product.productId}`}
        state={{ product }}
        className="relative w-full h-72 border-b border-gray-300 dark:border-gray-600"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full xl:hover:shadow-depth-l xl:dark:hover:shadow-depth-l object-cover transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </Link>
      <div className="relative h-48 p-4 flex flex-col font-primary">
        <Link to={`/products/${product.productId}`} state={{ product }}>
          <h2 className="text-xl font-semibold text-primary dark:text-lighter mb-2">
            {product.name}
          </h2>
        </Link>
        <Link to={`/products/${product.productId}`} state={{ product }}>
          <p className="text-base text-gray-600 dark:text-light mb-4">
            {product.description}
          </p>
        </Link>
        <div className="flex items-center justify-between mt-auto">
          <div className="bg-normalbg dark:bg-light shadow-depth-s dark:shadow-depth-l text-primary dark:text-gray-600 font-medium text-sm py-2 px-5 rounded-full">
            <Price currency="$" price={product.price} />
          </div>

          {isAdmin ? (
            <Link
              to={`/admin/products/edit/${product.productId}`}
              className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 transition duration-200 shadow-l dark:shadow-l text-white font-black text-sm py-2 px-4 rounded-full hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-1" />
              Edit
            </Link>
          ) : (
            <button
              onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
              className="bg-primary hover:bg-blue-700 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-500 transition duration-200 shadow-l dark:shadow-l text-white font-black text-sm py-2 px-4 rounded-full hover:cursor-pointer"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
