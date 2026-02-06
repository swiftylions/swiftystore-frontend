import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "./PageTitle";
import emptyCartImage from "../assets/util/emptycart.png";
import { useSelector } from "react-redux";
import { selectCartItems } from "../store/cart-slice";
import CartTable from "./CartTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { selectUser, selectIsAuthenticated } from "../store/auth-slice";

export default function Cart() {
  const cart = useSelector(selectCartItems);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const isAddressIncomplete = useMemo(() => {
    if (!isAuthenticated) return false;
    if (!user.address) return true;
    const { street, city, postalCode, country, state } = user.address;
    return !street || !city || !state || !postalCode || !country;
  }, [user]);

  const navigate = useNavigate();

  const isCartEmpty = useMemo(() => cart.length === 0, [cart.length]);

  return (
    <div className="min-h-[852px] py-12 bg-normalbg dark:bg-darkbg font-primary">
      <div className="max-w-4xl mx-auto px-4">
        <PageTitle title="Your Cart" />
        {!isCartEmpty ? (
          <>
            {isAddressIncomplete && (
              <p className="bg-red-600 dark:bg-red-700 p-2 rounded-full dark:text-red-200 text-lighter text-lg mt-2 text-center animate-bounce">
                Please <span className="text-lighter">update</span> your address
                details inside{" "}
                <a
                  href="/profile"
                  className="text-blue-200 underline dark:text-lighter"
                >
                  Profile settings
                </a>{" "}
                to{" "}
                <span className="text-lighter animate-pulse">
                  proceed to checkout
                </span>
                .
              </p>
            )}
            <CartTable />
            <div className="flex justify-between mt-8 space-x-4">
              <Link
                to="/home"
                className="py-2 px-4 rounded-full shadow-l bg-primary dark:bg-light text-white dark:text-black text-xl"
              >
                Back to Products
              </Link>
              <Link
                to={isAddressIncomplete ? "#" : "/checkout"}
                className={`py-2 px-4 rounded-full  ${
                  isAddressIncomplete
                    ? "shadow-depth-m bg-gray-400 cursor-not-allowed text-gray-200 dark:text-gray-700"
                    : "shadow-l bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter text-white dark:text-black"
                }  text-xl cursor-pointer`}
                onClick={(e) => {
                  if (isAddressIncomplete) {
                    e.preventDefault();
                  }
                }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 dark:text-lighter flex flex-col items-center">
            <p className="max-w-[576px] px-2 mx-auto text-base mb-4">
              Oops... Your cart is empty. Continue shopping
            </p>
            <img
              src={emptyCartImage}
              alt="Empty Cart"
              className="max-w-[300px] mx-auto mb-6 dark:rounded-4xl dark:invert-83 dark:grayscale"
            />

            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate("/home");
                  }
                }}
                className="py-2 px-4 bg-primary dark:bg-light text-white dark:text-black text-xl font-semibold rounded-3xl hover:bg-dark dark:hover:bg-lighter transition"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp;Back to Previous Page
              </button>
              <Link
                to="/home"
                className="py-2 px-4 bg-primary dark:bg-light text-white dark:text-black text-xl font-semibold rounded-3xl hover:bg-dark dark:hover:bg-lighter transition"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                &nbsp; Back to Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
