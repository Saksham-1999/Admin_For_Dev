import { Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import {
  validateEmail,
  validateIP,
  validateProtocol,
  validatePrototype,
  validateUrl,
} from "../../../Validation";

function CreateRogueDBModal({ isOpen, onClose, activeTab, onSubmit, loading }) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case "url":
        return validateUrl(value)
          ? ""
          : "URL must be in valid format (e.g., https://example.com)";
      case "protocol":
        return validateProtocol(value)
          ? ""
          : "Protocol must be either HTTP or HTTPS";
      case "ip":
        return validateIP(value)
          ? ""
          : "Enter a valid IPv4 (e.g., 192.168.1.1) or IPv6 address";
      case "prototype":
        return validatePrototype(value)
          ? ""
          : "Prototype must be either IPv4 or IPv6";
      case "mailid":
        return validateEmail(value)
          ? ""
          : "Enter a valid email address (e.g., user@domain.com)";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  useEffect(() => {
    if (!isOpen) {
      handleClear();
    }
  }, [isOpen]);

  const handleClear = () => {
    setFormData({});
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Object.keys(errors).some((key) => errors[key])) {
      onSubmit(e);
      handleClear();
    }
  };

  if (!isOpen) return null;

  const renderForm = () => {
    switch (activeTab) {
      case "url":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <input
                type="text"
                name="url"
                value={formData.url || ""}
                placeholder="Enter URL"
                onChange={handleInputChange}
                onBlur={handleInputChange}
                required
                className={`block w-full rounded px-3 py-2 dark:bg-gray-700 text-secondary-foreground bg-gray-200 outline-none focus:ring-0 ${
                  errors.url ? "border border-red-500" : "border border-primary"
                }`}
              />
              {errors.url && (
                <p className="text-red-500 text-sm mt-1">{errors.url}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="protocol"
                value={formData.protocol || ""}
                placeholder="Enter Protocol (HTTP/HTTPS)"
                onChange={handleInputChange}
                onBlur={handleInputChange}
                required
                className={`block w-full rounded px-3 py-2 dark:bg-gray-700 text-secondary-foreground bg-gray-200 outline-none focus:ring-0 ${
                  errors.protocol
                    ? "border border-red-500"
                    : "border border-primary"
                }`}
              />
              {errors.protocol && (
                <p className="text-red-500 text-sm mt-1">{errors.protocol}</p>
              )}
            </div>
            <div className="w-full flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-secondary-foreground hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={
                  Object.keys(errors).some((key) => errors[key]) || loading
                }
                className={`bg-primary text-white px-4 py-2 rounded ${
                  Object.keys(errors).some((key) => errors[key]) || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/80"
                }`}
              >
                {loading ? "Creating..." : "Add URL"}
              </button>
            </div>
          </form>
        );
      case "domain":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <input
                type="text"
                name="ip"
                value={formData.ip || ""}
                placeholder="Enter IP Address"
                onChange={handleInputChange}
                onBlur={handleInputChange}
                required
                className={`block w-full rounded px-3 py-2 dark:bg-gray-700 text-secondary-foreground bg-gray-200 outline-none focus:ring-0 ${
                  errors.ip ? "border border-red-500" : "border border-primary"
                }`}
              />
              {errors.ip && (
                <p className="text-red-500 text-sm mt-1">{errors.ip}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="prototype"
                value={formData.prototype || ""}
                placeholder="Enter Prototype (IPv4/IPv6)"
                onChange={handleInputChange}
                onBlur={handleInputChange}
                required
                className={`block w-full rounded px-3 py-2 dark:bg-gray-700 text-secondary-foreground bg-gray-200 outline-none focus:ring-0 ${
                  errors.prototype
                    ? "border border-red-500"
                    : "border border-primary"
                }`}
              />

              {errors.prototype && (
                <p className="text-red-500 text-sm mt-1">{errors.prototype}</p>
              )}
            </div>
            <div className="w-full flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-secondary-foreground hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={
                  Object.keys(errors).some((key) => errors[key]) || loading
                }
                className={`bg-primary text-white px-4 py-2 rounded ${
                  Object.keys(errors).some((key) => errors[key]) || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/80"
                }`}
              >
                {loading ? "Creating..." : "Add Domain"}
              </button>
            </div>
          </form>
        );
      case "mail":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <input
                type="email"
                name="mailid"
                value={formData.mailid || ""}
                placeholder="Enter Email"
                onChange={handleInputChange}
                onBlur={handleInputChange}
                required
                className={`block w-full rounded px-3 py-2 dark:bg-gray-700 text-secondary-foreground bg-gray-200 outline-none focus:ring-0 ${
                  errors.mailid
                    ? "border border-red-500"
                    : "border border-primary"
                }`}
              />
              {errors.mailid && (
                <p className="text-red-500 text-sm mt-1">{errors.mailid}</p>
              )}
            </div>
            <div className="w-full flex items-center justify-end gap-5">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-secondary-foreground hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={
                  Object.keys(errors).some((key) => errors[key]) || loading
                }
                className={`bg-primary text-white px-4 py-2 rounded ${
                  Object.keys(errors).some((key) => errors[key]) || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary/80"
                }`}
              >
                {loading ? "Creating..." : "Add Mail"}
              </button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-[450px] bg-white dark:bg-gray-800 p-6 rounded-lg relative">
        <h2 className="text-xl font-bold mb-4 text-secondary-foreground">
          Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h2>
        {renderForm()}
        <button
          onClick={onClose}
          className="text-red-500 rounded-full absolute top-2 right-2"
        >
          <Close className="w-1 h-1" />
        </button>
      </div>
    </div>
  );
}

export default CreateRogueDBModal;
