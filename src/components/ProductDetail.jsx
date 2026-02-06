import { useLocation } from "react-router-dom";
import {
  faArrowLeft,
  faShoppingCart,
  faShoppingBasket,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/auth-slice";
import { addToCart } from "../store/cart-slice";

export default function ProductDetail() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const location = useLocation();
  const product = location.state?.product;
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const zoomRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const handleAddToCart = () => {
    if (quantity < 1) return;
    dispatch(addToCart({ product, quantity }));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10) || 1;
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleMouseMove = (e) => {
    let clientX, clientY;

    // اگر رویداد، رویداد لمسی باشد (برای موبایل)
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    // اگر رویداد، رویداد ماوس باشد (برای دسکتاپ)
    else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // 2. بررسی ایمنی Ref
    if (!zoomRef.current) return;

    // 3. محاسبه موقعیت
    const { left, top, width, height } =
      zoomRef.current.getBoundingClientRect();

    // محاسبه موقعیت x و y بر اساس مختصات client (که هم در تاچ و هم در ماوس کار می‌کند)
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;

    setBackgroundPosition(`${x}% ${y}%`);
  };

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setBackgroundPosition("center");
  };

  const handleViewCart = () => navigate("/cart");

  return (
    <div className="min-h-[852px] flex items-center justify-center px-6 py-8 font-primary bg-normalbg dark:bg-darkbg">
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row md:space-x-8 px-6 p-8">
        {/* Product Image with Zoom Effect */}
        <div
          ref={zoomRef}
          // ✅ افزودن رویدادهای ماوس
          onMouseMove={isHovering ? handleMouseMove : null}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          // ✅ افزودن رویدادهای لمسی برای سازگاری با موبایل
          onTouchStart={handleMouseEnter} // شروع لمس = شروع هاور
          onTouchMove={isHovering ? handleMouseMove : null} // اجرای تابع اصلاح شده
          onTouchEnd={handleMouseLeave} // پایان لمس = پایان هاور
          onTouchCancel={handleMouseLeave} // لغو لمس
          className="w-full md:w-1/2 border border-gray-300 dark:border-gray-600 rounded-4xl xl:border-0 xl:shadow-depth-l overflow-hidden bg-cover"
          style={{
            backgroundImage: `url(${product.imageUrl})`,
            backgroundSize: isHovering ? "200%" : "cover",
            backgroundPosition: backgroundPosition,
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full opacity-0"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col space-y-6 mt-8 md:mt-0">
          <Link
            to="/home"
            className="inline-flex items-center text-primary dark:text-light font-medium hover:text-dark dark:hover:text-lighter"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back To All Products
          </Link>

          <div>
            <h1 className="text-3xl font-extrabold text-primary dark:text-light mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-dark dark:text-lighter mb-4">
              {product.description}
            </p>
            <div className="text-2xl font-bold text-primary dark:text-light">
              ${product.price}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {isAdmin ? (
              <Link
                to={`/admin/products/edit/${product.productId}`}
                className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 transition duration-200 shadow-l dark:shadow-l text-white rounded-full hover:cursor-pointer w-full px-4 py-2 text-lg font-semibold"
              >
                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                Edit
              </Link>
            ) : (
              <>
                {/* Quantity Input */}
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="quantity"
                    className="text-primary dark:text-light"
                  >
                    Qty:
                  </label>
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="w-7 h-7 items-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 xl:shadow-m xl:dark:shadow-l"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-13 px-2 py-1 rounded-2xl xl:shadow-depth-m xl:dark:shadow-depth-l transition ease-in duration-100 backdrop-blur-lg bg-white dark:bg-gray-900 xl:bg-transparent xl:dark:bg-transparent xl:backdrop-brightness-120 xl:dark:backdrop-brightness-70 shadow-sm focus:shadow-l dark:focus:shadow-l dark:focus:shadow-gray-600 focus:outline-none text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-7 h-7 items-center bg-gray-200 dark:bg-gray-700 rounded-full text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 xl:shadow-m xl:dark:shadow-l"
                  >
                    +
                  </button>
                </div>
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full px-4 py-2 bg-primary dark:bg-light text-white dark:text-black rounded-3xl shadow-l text-lg font-semibold hover:bg-dark dark:hover:bg-lighter transition"
                >
                  Add to Cart
                  <FontAwesomeIcon icon={faShoppingCart} className="ml-2" />
                </button>

                {/* View Cart Button */}
                <button
                  onClick={handleViewCart}
                  className="w-full px-4 py-2 bg-primary dark:bg-light text-white dark:text-black rounded-3xl shadow-l text-lg font-semibold hover:bg-dark dark:hover:bg-lighter transition"
                >
                  View Cart
                  <FontAwesomeIcon icon={faShoppingBasket} className="ml-2" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
