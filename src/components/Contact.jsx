import React from "react";
import PageTitle from "./PageTitle";
import apiClient from "../api/apiClient";
import {
  Form,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const contactInfo = useLoaderData();
  const navigation = useNavigation();
  const actionData = useActionData();
  const formRef = useRef(null);
  const submit = useSubmit();
  const isSubmiting = navigation.state === "submitting";
  useEffect(() => {
    if (actionData?.success) {
      formRef.current?.reset();
      toast.success("Thank you. message submited successfuly!");
    }
  }, [actionData]);
  const handleSubmit = (event) => {
    event.preventDefault();
    const userConfirmed = window.confirm(
      "Are you sure you want to submit the form ?"
    );

    if (userConfirmed) {
      const formData = new FormData(formRef.current); //get form data
      submit(formData, { method: "POST" }); //proceed with form submition
    } else {
      toast.info("Form submition cancled!");
    }
  };
  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border xl:border-none xl:shadow-depth-m xl:dark:shadow-depth-l xl:focus:shadow-depth-s xl:dark:focus:shadow-depth-s focus:bg-white focus:dark:bg-gray-500 xl:focus:ring-0 rounded-3xl transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-gray-200 dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300 shadow-md dark:shadow-sm dark:shadow-gray-700";
  return (
    <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-8 font-primary bg-normalbg dark:bg-darkbg">
      {/* Page Title */}
      <PageTitle title="Contact Us" />
      {/* Contact Info */}
      <p className="max-w-[768px] mx-auto mt-8 text-gray-600 dark:text-lighter mb-8 text-center">
        We'd love to hear from you! If you have any questions, feedback, or
        suggestions, please don't hesitate to reach out.
      </p>

      {/* Contact Info + Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-[952px] mx-auto mt-8">
        {/* Left: Contact Details */}
        <div className="text-primary dark:text-light  p-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Info</h2>
          {contactInfo && (
            <>
              <p className="mb-4">
                <strong>Phone:</strong>{" "}
                <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
              </p>
              <p className="mb-4">
                <strong>Email:</strong>{" "}
                <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
              </p>
              <p className="mb-4">
                <strong>Address:</strong> {contactInfo.address}
              </p>
            </>
          )}
        </div>

        {/* Contact Form */}
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          method="POST"
          className="space-y-6 max-w-[1152px] min-w-[100%] mx-auto"
        >
          {/* Name Field */}
          <div>
            <label htmlFor="name" className={labelStyle}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              className={textFieldStyle}
              required
              minLength={3}
              maxLength={30}
            />
            {actionData?.errors?.name && (
              <p className="text-red-500 dark:text-red-300 text-sm mt-2">
                {actionData.errors.name}
              </p>
            )}
          </div>

          {/* Email and mobile Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className={labelStyle}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your Email"
                className={textFieldStyle}
                required
              />
              {actionData?.errors?.email && (
                <p className="text-red-500 dark:text-red-300 text-sm mt-2">
                  {actionData.errors.email}
                </p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label htmlFor="mobileNumber" className={labelStyle}>
                Mobile Number
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                required
                pattern="^(?:\+?98|0)?9\d{9}$"
                title="Mobile number must be valid & at least 9 digits"
                placeholder="Your Mobile Number"
                className={textFieldStyle}
              />
              {actionData?.errors?.mobileNumber && (
                <p className="text-red-500 dark:text-red-300 text-sm mt-2">
                  {actionData.errors.mobileNumber}
                </p>
              )}
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label htmlFor="message" className={labelStyle}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Your Message"
              className={textFieldStyle}
              required
              minLength={5}
              maxLength={500}
            ></textarea>
            {actionData?.errors?.message && (
              <p className="text-red-500 dark:text-red-300 text-sm mt-2">
                {actionData.errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmiting}
              className="px-6 py-2 text-white dark:text-black text-xl shadow-2xl dark:shadow-lg dark:shadow-gray-700 rounded-full transition duration-200 bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter"
            >
              {isSubmiting ? "submiting..." : "submit"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export async function contactAction({ request, params }) {
  const data = await request.formData();

  const contactData = {
    name: data.get("name"),
    email: data.get("email"),
    mobileNumber: data.get("mobileNumber"),
    message: data.get("message"),
  };
  try {
    await apiClient.post("/contacts", contactData);
    return { success: true };
    // return redirect("/home");
  } catch (error) {
    if (error.response?.status === 400) {
      return { success: false, errors: error.response?.data };
    }
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to submit your message! Please try again.",
      { status: error.status || 500 }
    );
  }
}

export async function contactLoader() {
  try {
    const response = await apiClient.get("/contacts"); //axios get request
    return response.data;
  } catch (error) {
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to fetch profile details. Please try again.",
      { status: error.status || 500 }
    );
  }
}
