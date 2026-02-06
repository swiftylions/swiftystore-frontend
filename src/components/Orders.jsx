import React from "react";
import apiClient from "../api/apiClient";
import { useLoaderData } from "react-router-dom";
import PageTitle from "./PageTitle";

export default function Orders() {
  const orders = useLoaderData();

  function formatDate(isoDate) {
    if (!isoDate) return "N/A";
    return new Date(isoDate).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return (
    <div className="min-h-[852px] container mx-auto px-6 py-12 font-primary dark:bg-darkbg">
      {orders.length === 0 ? (
        <p className="text-center text-2xl  text-primary dark:text-lighter">
          No orders found.
        </p>
      ) : (
        <div className="space-y-6 mt-4">
          <PageTitle title="My Orders" />
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white dark:bg-gray-700 shadow-md rounded-3xl p-6"
            >
              <h2 className="text-xl font-semibold mb-2 text-primary dark:text-lighter">
                Order #{order.orderId}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status:{" "}
                <span className="font-medium text-gray-800 dark:text-lighter">
                  {order.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Price:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  ${order.totalPrice}
                </span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Date:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(order.createdAt)}
                </span>
              </p>

              <div
                className="mt-4 space-y-4 flex gap-10 overflow-scroll
              "
              >
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex-col justify-center items-center pb-4"
                  >
                    <div class="w-20 h-20 sm:w-24 md:h-30 md:w-30 sm:h-24 mb-4">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="">
                      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity:{" "}
                        <span className="text-light">{item.quantity}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Price: <span className="text-light">${item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export async function ordersLoader() {
  try {
    const response = await apiClient.get("/orders"); // Axios GET Request
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch orders. Please try again.",
      { status: error.status || 500 }
    );
  }
}
