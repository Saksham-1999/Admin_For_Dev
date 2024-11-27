import React, { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import {
  validateUrl,
  validateProtocol,
  validateIP,
  validatePrototype,
  validateEmail,
} from "../../../Validation";

function EditRogueDBModal({
  isOpen,
  onClose,
  onSubmit,
  item,
  activeTab,
  loading,
}) {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item]);

  if (!isOpen || !item) return null;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!Object.keys(errors).some((key) => errors[key])) {
      onSubmit(e);
    }
  };

  const renderFields = () => {
    const fields = {
      url: ["url", "protocol"],
      domain: ["ip", "prototype"],
      mail: ["mailid"],
    }[activeTab];

    return fields.map((field) => (
      <div key={field} className="mb-4">
        <label
          htmlFor={field}
          className="block text-sm font-medium text-secondary-foreground mb-1"
        >
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </label>
        <input
          type={field === "mailid" ? "email" : "text"}
          id={field}
          name={field}
          value={formData[field] || ""}
          onChange={handleInputChange}
          onBlur={handleInputChange}
          className={`mt-1 block w-full rounded px-3 py-2 dark:bg-gray-700 text-secondary-foreground bg-gray-200 outline-none focus:ring-0
            ${errors[field] ? "border border-red-500" : "border border-primary"}`}
        />
        {errors[field] && (
          <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
        )}
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full relative">
        <h2 className="text-2xl font-bold mb-4 text-secondary-foreground">
          Edit {activeTab.toUpperCase()}
        </h2>
        <form onSubmit={handleSubmit}>
          {renderFields()}
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                Object.keys(errors).some((key) => errors[key]) || loading
              }
              className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                Object.keys(errors).some((key) => errors[key]) || loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-600"
              }`}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <Close />
        </button>
      </div>
    </div>
  );
}

export default EditRogueDBModal;
