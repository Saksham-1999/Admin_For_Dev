import React, { useEffect, useState } from "react";
import { editUserProfile, fetchCurrentUserData } from "../Api/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuLoader } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCamera,
} from "react-icons/fa";
import {
  validateName,
  validatePhoneNumber,
  validateAddress,
  validateOrganization,
  validateAvatar,
  validateEmail,
} from "../Validation";

function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    organization: "",
  });

  const inputFields = [
    {
      key: "username",
      icon: <FaUser />,
      type: "text",
      label: "Username",
      readOnly: true,
    },
    {
      key: "email",
      icon: <FaEnvelope />,
      type: "email",
      label: "Email",
      readOnly: true,
    },
    {
      key: "first_name",
      icon: <FaUser />,
      type: "text",
      label: "First Name",
      validation: validateName,
    },
    {
      key: "last_name",
      icon: <FaUser />,
      type: "text",
      label: "Last Name",
      validation: validateName,
    },
    {
      key: "phone_number",
      icon: <FaPhone />,
      type: "tel",
      label: "Phone Number",
      validation: validatePhoneNumber,
    },
    {
      key: "address",
      icon: <FaMapMarkerAlt />,
      type: "text",
      label: "Address",
      validation: validateAddress,
    },
    {
      key: "organization",
      icon: <FaBuilding />,
      type: "text",
      label: "Organization",
      validation: validateOrganization,
    },
  ];

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user && userInfo) {
      setFormData({
        email: userInfo.email || "",
        username: user.username || "",
        first_name: userInfo.first_name || "",
        last_name: userInfo.last_name || "",
        phone_number: userInfo.phone_number || "",
        address: userInfo.address || "",
        organization: userInfo.organization || "",
      });
      setAvatar(userInfo.avatar || null);
    }
  }, [user, userInfo]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCurrentUserData();
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      } else {
        toast.warn("No user data found! Update your profile");
      }
    } catch (error) {
      toast.error("Error fetching user data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "first_name":
      case "last_name":
        return validateName(value)
          ? ""
          : "Name must contain only letters and spaces, length between 2-30 characters. Ensures the first character is a capital letter.";

      case "phone_number":
        return validatePhoneNumber(value)
          ? ""
          : "Phone number must be 10-15 digits with optional + prefix";

      case "address":
        return validateAddress(value)
          ? ""
          : "Address must contain alphanumeric characters, spaces, commas, periods, hyphens and #, length 5-100. Ensures the first character is a capital letter.";

      case "organization":
        return validateOrganization(value)
          ? ""
          : "Organization name must contain letters, numbers, spaces and business identifiers, length 2-50. Ensures the first character is a capital letter.";

      case "email":
        return validateEmail(value)
          ? ""
          : "Please enter a valid email format with @ and domain";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validationResult = validateAvatar(file);
      if (!validationResult.isValid) {
        toast.error(
          `Invalid file. Please use ${validationResult.validTypes.join(
            ", "
          )} under ${validationResult.maxSize / (1024 * 1024)}MB`
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      const updatedFormData = { ...formData, avatar };
      const response = await editUserProfile(updatedFormData);

      if (response.ok) {
        const updatedUser = await response.json();
        setUserInfo(updatedUser);
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating the profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary dark:bg-gray-900 h-20 px-5 flex items-center">
          <h2 className="text-3xl font-bold text-white tracking-widest">
            Edit Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map(({ key, icon, type, label, readOnly }) => (
              <div key={key} className="relative">
                <label
                  htmlFor={key}
                  className="text-sm font-medium text-gray-700 dark:text-white mb-1 block"
                >
                  {label}
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">{icon}</span>
                  </div>
                  <input
                    type={type}
                    name={key}
                    id={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                    placeholder={`Enter ${label}`}
                    className={`block w-full text-secondary-foreground pl-10 sm:text-sm border h-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      readOnly
                        ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                        : "dark:bg-gray-700"
                    } ${errors[key] ? "border-red-500" : ""}`}
                    readOnly={readOnly}
                  />
                </div>
                {errors[key] && (
                  <p className="mt-1 text-xs text-red-500">{errors[key]}</p>
                )}
                {readOnly && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-white tracking-wider">
                    This field cannot be edited
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Link to="/profile">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-white dark:hover:bg-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <LuLoader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Updating...
                </span>
              ) : (
                "Update Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
