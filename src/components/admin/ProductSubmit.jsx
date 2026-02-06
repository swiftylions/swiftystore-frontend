import React, { useEffect, useRef, useState } from "react";
import PageTitle from "../PageTitle";
import apiClient from "../../api/apiClient";
import {
  Form,
  useActionData,
  useNavigation,
  useSubmit,
  useParams,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function ProductSubmit() {
  const { id } = useParams();
  const navigation = useNavigation();
  const actionData = useActionData();
  const formRef = useRef(null);
  const submit = useSubmit();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
  });

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await apiClient.get(`/products/${id}`);
          const product = response.data;
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl || "",
          });
        } catch (error) {
          toast.error("Failed to load product details.");
          navigate("/home");
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(
        isEditMode
          ? "Product updated successfully!"
          : "Product created successfully!"
      );
      navigate("/home");
    }
  }, [actionData, isEditMode, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const userConfirmed = window.confirm(
      `Are you sure you want to ${
        isEditMode ? "update" : "submit"
      } the product?`
    );

    if (userConfirmed) {
      const formDataObj = new FormData(formRef.current);
      submit(formDataObj, {
        method: isEditMode ? "PUT" : "POST",
        action: isEditMode
          ? `/admin/products/edit/${id}`
          : "/admin/products/create",
      });
    } else {
      toast.info("Operation cancelled!");
    }
  };

  const handleDelete = async () => {
    const userConfirmed = window.confirm(
      "Are you sure you want to DELETE this product? This action cannot be undone!"
    );

    if (!userConfirmed) {
      toast.info("Delete cancelled!");
      return;
    }

    try {
      setIsDeleting(true);
      await apiClient.delete(`/admin/products/${id}`);
      toast.success("Product deleted successfully!");
      navigate("/home");
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const labelStyle =
    "block text-lg font-semibold text-primary dark:text-light mb-2";
  const textFieldStyle =
    "w-full px-4 py-2 text-base border xl:border-none xl:shadow-depth-m xl:dark:shadow-depth-l xl:focus:shadow-depth-s xl:dark:focus:shadow-depth-s focus:bg-white focus:dark:bg-gray-500 xl:focus:ring-0 rounded-3xl transition border-primary dark:border-light focus:ring focus:ring-dark dark:focus:ring-lighter focus:outline-none text-gray-800 dark:text-lighter bg-gray-200 dark:bg-gray-600 placeholder-gray-400 dark:placeholder-gray-300 shadow-md dark:shadow-sm dark:shadow-gray-700";

  return (
    <div className="max-w-[1152px] min-h-[852px] mx-auto px-6 py-8 font-primary bg-normalbg dark:bg-darkbg">
      <PageTitle title={isEditMode ? "Edit Product" : "Create New Product"} />
      <p className="max-w-[768px] mx-auto mt-8 text-gray-600 dark:text-lighter mb-8 text-center">
        {isEditMode
          ? "Update the product details below."
          : "Fill in the details to add a new product to the store."}
      </p>

      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        method={isEditMode ? "PUT" : "POST"}
        className="space-y-6 max-w-[768px] mx-auto"
      >
        {/* Name Field */}
        <div>
          <label htmlFor="name" className={labelStyle}>
            Product Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter product name"
            className={textFieldStyle}
            required
            minLength={3}
            maxLength={250}
            value={formData.name}
            onChange={handleChange}
          />
          {actionData?.errors?.name && (
            <p className="text-red-500 dark:text-red-300 text-sm mt-2">
              {actionData.errors.name}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className={labelStyle}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            placeholder="Enter product description"
            className={textFieldStyle}
            required
            minLength={5}
            maxLength={500}
            value={formData.description}
            onChange={handleChange}
          />
          {actionData?.errors?.description && (
            <p className="text-red-500 dark:text-red-300 text-sm mt-2">
              {actionData.errors.description}
            </p>
          )}
        </div>

        {/* Price Field */}
        <div>
          <label htmlFor="price" className={labelStyle}>
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Enter product price"
            className={textFieldStyle}
            required
            value={formData.price}
            onChange={handleChange}
          />
          {actionData?.errors?.price && (
            <p className="text-red-500 dark:text-red-300 text-sm mt-2">
              {actionData.errors.price}
            </p>
          )}
        </div>

        {/* Image URL Field */}
        <div>
          <label htmlFor="imageUrl" className={labelStyle}>
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            placeholder="Enter image URL"
            className={textFieldStyle}
            maxLength={500}
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {actionData?.errors?.imageUrl && (
            <p className="text-red-500 dark:text-red-300 text-sm mt-2">
              {actionData.errors.imageUrl}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isDeleting}
            className="px-6 py-2 text-white dark:text-black text-xl shadow-2xl dark:shadow-lg dark:shadow-gray-700 rounded-full transition duration-200 bg-primary dark:bg-light hover:bg-dark dark:hover:bg-lighter disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Product"
              : "Create Product"}
          </button>

          {/* Delete Button (فقط در Edit mode) */}
          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="px-6 py-2 text-white text-xl shadow-2xl rounded-full transition duration-200 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                "Deleting..."
              ) : (
                <>
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete Product
                </>
              )}
            </button>
          )}
        </div>
      </Form>
    </div>
  );
}

// Actions همون قبلی
export async function createProductAction({ request }) {
  const data = await request.formData();

  const productData = {
    name: data.get("name"),
    description: data.get("description"),
    price: parseFloat(data.get("price")),
    imageUrl: data.get("imageUrl"),
  };

  try {
    await apiClient.post("/admin/products", productData);
    return { success: true };
  } catch (error) {
    if (error.response?.status === 400) {
      return { success: false, errors: error.response?.data };
    }
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to create product! Please try again.",
      { status: error.status || 500 }
    );
  }
}

export async function updateProductAction({ request, params }) {
  const { id } = params;
  const data = await request.formData();

  const productData = {
    name: data.get("name"),
    description: data.get("description"),
    price: parseFloat(data.get("price")),
    imageUrl: data.get("imageUrl"),
  };

  try {
    await apiClient.put(`/admin/products/${id}`, productData);
    return { success: true };
  } catch (error) {
    if (error.response?.status === 400) {
      return { success: false, errors: error.response?.data };
    }
    throw new Response(
      error.response?.data?.errorMessage ||
        error.message ||
        "Failed to update product! Please try again.",
      { status: error.status || 500 }
    );
  }
}
