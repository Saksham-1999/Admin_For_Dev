import { Close } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createLicense } from "../../../Api/api";
import {
  validateLicenseId,
  validateLicenseOrganization,
  validateValidTillDate,
  validateValidFromDate,
} from "../../../Validation";

function CreateSingleLicense({ setShowForm, getLicenses }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() => {
    // Get today's date for validFrom
    const today = new Date();
    // Get date after one year for validTill
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    return {
      licenseId: "",
      organisation: "IAF", // Set default organization to IAF
      validFrom: today.toISOString().split("T")[0],
      validFromTime: "00:00",
      validTill: nextYear.toISOString().split("T")[0],
      validTillTime: "23:59",
    };
  });

  const validateField = (name, value) => {
    switch (name) {
      case "licenseId":
        return !validateLicenseId(value)
          ? "License ID must be 3-30 characters long and can contain letters, numbers and hyphens"
          : "";
      case "organisation":
        return !validateLicenseOrganization(value)
          ? "Organization name must be 2-100 characters long. Ensures the first character is a capital letter."
          : "";
      case "validFrom":
        if (formData.validFrom) {
          const fromValidation = validateValidFromDate(formData.validFrom);
          return !fromValidation.isValid ? fromValidation.message : "";
        }
        return "";
      case "validTill":
        if (formData.validFrom && formData.validTill) {
          const tillValidation = validateValidTillDate(
            formData.validFrom,
            formData.validTill
          );
          return !tillValidation.isValid ? tillValidation.message : "";
        }
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Validate dates whenever any date/time field changes
  useEffect(() => {
    if (formData.validFrom && formData.validFromTime) {
      const fromError = validateField("validFrom", formData.validFrom);
      setErrors((prev) => ({ ...prev, validFrom: fromError }));
    }
    if (formData.validTill && formData.validTillTime) {
      const tillError = validateField("validTill", formData.validTill);
      setErrors((prev) => ({ ...prev, validTill: tillError }));
    }
  }, [
    formData.validFrom,
    formData.validFromTime,
    formData.validTill,
    formData.validTillTime,
  ]);

  const generateNextLicenseId = (lastId) => {
    if (!lastId) return "LIC-00001";

    const numPart = lastId.split("-")[1];
    const nextNum = String(Number(numPart) + 1).padStart(5, "0");
    return `LIC-${nextNum}`;
  };

  useEffect(() => {
    fetchAndSetNextLicenseId();
  }, []);

  const fetchAndSetNextLicenseId = async () => {
    try {
      const response = await getLastLicenseId();
      const data = await response.json();
      const nextId = generateNextLicenseId(data.last_license_id);
      setFormData((prev) => ({ ...prev, licenseId: nextId }));
    } catch (error) {
      setFormData((prev) => ({ ...prev, licenseId: "LIC-00001" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (hasErrors) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createLicense(formData);
      if (response.license_id) {
        toast.success("License created successfully");
        setShowForm(false);
        getLicenses();
      } else {
        toast.error("Failed to create license");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create license");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center fixed inset-0 z-50 bg-black bg-opacity-80">
      <div className="w-96 flex flex-col justify-center bg-background dark:bg-gray-800 shadow rounded-lg overflow-hidden relative">
        <div className="">
          <Close
            className="absolute top-2 right-2 cursor-pointer text-gray-500"
            onClick={() => setShowForm(false)}
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl mt-4 font-extrabold text-primary">
            Create New License
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="licenseId"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  License ID*
                </label>
                <div className="mt-1">
                  <input
                    id="licenseId"
                    name="licenseId"
                    type="text"
                    required
                    value={formData.licenseId}
                    onChange={handleChange}
                    placeholder="Example: LIC-00001"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.licenseId ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700`}
                  />
                  {errors.licenseId && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.licenseId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="organisation"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Organisation*
                </label>
                <div className="mt-1">
                  <input
                    id="organisation"
                    name="organisation"
                    type="text"
                    required
                    value={formData.organisation}
                    onChange={handleChange}
                    placeholder="Organisation name"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.organisation ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700`}
                  />
                  {errors.organisation && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.organisation}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                <div>
                  <label
                    htmlFor="validFrom"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Valid From*
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <input
                      id="validFrom"
                      name="validFrom"
                      type="date"
                      required
                      value={formData.validFrom}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.validFrom ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700`}
                    />
                    <input
                      id="validFromTime"
                      name="validFromTime"
                      type="time"
                      readOnly
                      value="00:00"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-secondary-foreground dark:bg-gray-700"
                    />
                  </div>
                  {errors.validFrom && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.validFrom}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="validTill"
                    className="block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Valid Till*
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <input
                      id="validTill"
                      name="validTill"
                      type="date"
                      required
                      value={formData.validTill}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.validTill ? "border-red-500" : "border-gray-300"
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700`}
                    />
                    <input
                      id="validTillTime"
                      name="validTillTime"
                      type="time"
                      value="23:59"
                      readOnly
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-secondary-foreground dark:bg-gray-700"
                    />
                  </div>
                  {errors.validTill && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.validTill}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading ? "bg-gray-400" : "bg-primary hover:bg-secondary"
                  } focus:outline-none transition duration-300 ease-in-out`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create License"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSingleLicense;
