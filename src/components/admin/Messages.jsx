import React from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import PageTitle from "../PageTitle";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailBulk, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Messages() {
  const messages = useLoaderData();
  const revalidator = useRevalidator();

  /**
   * Handle Order Cancellation
   */
  const handleCloseMessage = async (contactId) => {
    try {
      await apiClient.patch(`/admin/messages/${contactId}/close`);
      toast.success("Message closed");
      revalidator.revalidate(); // 🔁 Re-run loader
    } catch (error) {
      toast.error("Failed to close message");
    }
  };

  return (
    <div className="min-h-[852px] container mx-auto px-6 py-12 font-primary dark:bg-darkbg">
      {messages.length === 0 ? (
        <p className="text-center text-2xl text-primary dark:text-lighter">
          No open messages found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <PageTitle title="Admin Contact Messages" />
          <table className="mt-4 w-auto table-fixed border-collapse overflow-scroll">
            <thead>
              <tr className="bg-primary dark:bg-light text-lighter dark:text-primary">
                <th className="w-1/6 px-4 py-2 text-left">Name</th>
                <th className="w-1/6 px-4 py-2 text-left">Email</th>
                <th className="w-1/6 px-4 py-2 text-left">Mobile #</th>
                <th className="w-2/5 px-4 py-2 text-left">Message</th>
                <th className="w-1/6 px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr
                  key={message.contactId}
                  className=" bg-white dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-lighter"
                >
                  <td className="border-b px-4 py-2 break-words">
                    {message.name}
                  </td>
                  <td className="border-b px-4 py-2 break-words">
                    {message.email}
                  </td>
                  <td className="border-b px-4 py-2 break-words">
                    {message.mobileNumber}
                  </td>
                  <td className="border-b px-4 py-2 break-words max-w-[300px] overflow-auto">
                    {message.message}
                  </td>
                  <td className="border-b p-4 text-center">
                    <button
                      aria-label="close-message"
                      onClick={() => handleCloseMessage(message.contactId)}
                      className="text-primary cursor-pointer dark:text-white rounded-full border border-primary xl:shadow-l xl:border-none dark:border-red-400 pt-2 pr-3 pl-3 pb-1 hover:bg-lighter dark:hover:bg-gray-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>{" "}
                    <a
                      className="text-primary cursor-pointer w-2 h-2 pt-4 pr-3 pl-3 pb-3 dark:text-white rounded-full border border-primary xl:shadow-l xl:border-none dark:border-red-400 hover:bg-lighter dark:hover:bg-gray-700"
                      href={`mailto:` + message.email}
                    >
                      <FontAwesomeIcon icon={faMailBulk} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export async function messagesLoader() {
  try {
    const response = await apiClient.get("/admin/messages"); // Axios GET Request
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch messages. Please try again.",
      { status: error.status || 500 }
    );
  }
}
