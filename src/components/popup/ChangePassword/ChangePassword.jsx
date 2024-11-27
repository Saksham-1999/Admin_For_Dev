import React, { useState } from "react";
import { changePassword } from "../../../Api/api";
import { toast } from "react-toastify";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { validatePassword } from "../../../Validation";

const ChangePassword = ({ onClose, Done }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    };

    // Current password validation
    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    // New password validation
    if (!validatePassword(newPassword)) {
      newErrors.newPassword =
        "Password must start with a capital letter, include lowercase letters, at least 1 number and 1 special character (!@#$%^&), and be 8+ characters";
      isValid = false;
    }

    // Repeat password validation
    if (newPassword !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
      isValid = false;
    }

    // Check if new password is same as current
    if (currentPassword === newPassword) {
      newErrors.newPassword =
        "New password cannot be the same as current password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (validateFields()) {
      setIsLoading(true);
      try {
        const response = await changePassword(currentPassword, newPassword);
        const data = await response.json();

        if (response.ok) {
          toast.success("Password changed successfully!");
          await Done();
          onClose();
        } else {
          toast.error(data.message || "Failed to change password");
          setErrors({
            ...errors,
            currentPassword: data.message || "Failed to change password",
          });
        }
      } catch (error) {
        toast.error("Error changing password");
        setErrors({
          ...errors,
          currentPassword: "Error changing password: " + error.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderPasswordInput = (
    label,
    value,
    onChange,
    showPassword,
    setShowPassword,
    error
  ) => (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type={showPassword ? "text" : "password"}
          className={`block w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isLoading}
        />
        {value?.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <HiEye className="w-5 h-5" />
            ) : (
              <HiEyeSlash className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
      <div className="bg-background rounded-lg w-[400px] p-[15px_30px] shadow-md relative text-secondary-foreground">
        <div className="flex justify-between items-center">
          <h2 className="flex justify-center w-full mb-5 text-3xl">
            Change Password
          </h2>
          <button
            onClick={onClose}
            className="absolute top-0 right-1 bg-transparent border-none text-2xl cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="mb-5">
          <div className="space-y-3 w-full">
            {renderPasswordInput(
              "Current Password",
              currentPassword,
              setCurrentPassword,
              showCurrentPassword,
              setShowCurrentPassword,
              errors.currentPassword
            )}
            {renderPasswordInput(
              "New Password",
              newPassword,
              setNewPassword,
              showNewPassword,
              setShowNewPassword,
              errors.newPassword
            )}
            {renderPasswordInput(
              "Confirm Password",
              repeatPassword,
              setRepeatPassword,
              showRepeatPassword,
              setShowRepeatPassword,
              errors.repeatPassword
            )}
          </div>

          <div className="flex justify-between mt-5">
            <button
              className="bg-red-500 text-white border-none py-2 px-5 cursor-pointer rounded"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className={`bg-green-500 text-white border-none py-2 px-5 cursor-pointer rounded flex items-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>

          <div className="mt-5 text-sm text-gray-600">
            <p>
              <strong>Password must:</strong>
            </p>
            <ul className="list-disc pl-5">
              <li>include lower and upper characters</li>
              <li>include at least 1 number or symbol</li>
              <li>be at least 8 characters long</li>
              <li>match in both fields</li>
              <li>cannot contain whitespaces and "|" symbol</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
