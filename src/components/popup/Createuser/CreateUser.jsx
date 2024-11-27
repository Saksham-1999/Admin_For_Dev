import React, { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateUsername,
} from "../../../Validation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { Close } from "@mui/icons-material";
import { createUser } from "../../../Api/api";

function CreateUser({ setShowForm, getUsers }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    role: "staff",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "first_name":
        if (!value) return "First name is required";
        if (!validateName(value))
          return "First name must be 2-30 characters long and contain only letters. Ensures the first character is a capital letter";
        return "";
      case "last_name":
        if (!value) return "Last name is required";
        if (!validateName(value))
          return "Last name must be 2-30 characters long and contain only letters. Ensures the first character is a capital letter";
        return "";
      case "username":
        if (!value) return "Username is required";
        if (!validateUsername(value))
          return "Username must be 3-20 characters long and can contain small letters, numbers, dots and underscores";
        return "";
      case "email":
        if (!validateEmail(value))
          return "Please enter a valid email format with @ and domain";
        return "";
      case "password":
        if (!validatePassword(value))
          return "Password must be at least 8 characters long and include a letter, a number, and a special character";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check of all fields
    const validationErrors = {
      first_name: validateField("first_name", formData.first_name),
      last_name: validateField("last_name", formData.last_name),
      username: validateField("username", formData.username),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    // Filter out empty error messages
    const activeErrors = Object.fromEntries(
      Object.entries(validationErrors).filter(([_, value]) => value !== "")
    );

    setErrors(activeErrors);

    if (Object.keys(activeErrors).length !== 0){
      toast.error("Please fill in all fields correctly");
    }

    // Only proceed if there are no validation errors
    if (Object.keys(activeErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await createUser(formData);
        if (response.ok) {
          toast.success("User created successfully");
          getUsers();
          setShowForm(false);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to create user");
        }
      } catch (error) {
        console.error(error.message);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 bottom-0 bg-black bg-opacity-80">
      <div className="w-96 py-2 flex flex-col justify-center dark:bg-gray-800 bg-background shadow rounded-lg overflow-hidden relative">
        <div className="">
          <Close
            className="absolute top-2 right-2 cursor-pointer text-gray-500"
            onClick={() => setShowForm(false)}
          />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-2xl font-extrabold text-primary">
            Create New User
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-2 px-4 sm:px-10">
            <form className="space-y-1" onSubmit={handleSubmit}>
              {/* First Name field */}
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="John"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.first_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Last Name field */}
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    placeholder="Doe"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Username field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="john.doe"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="john@example.com"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password field with visibility toggle */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="John@123"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FaEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-2 text-xs text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Role field */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Role
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-secondary-foreground dark:bg-gray-700"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="staff">Staff</option>
                    {/* <option value="superadmin">Super Admin</option> */}
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none transition duration-300 ease-in-out mt-4"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    "Create user"
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

export default CreateUser;
