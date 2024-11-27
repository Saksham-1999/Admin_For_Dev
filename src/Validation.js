// Validates name with only letters and spaces, length between 2-30 characters, Ensures the first character is a capital letter.
export const validateName = (name) => {
  // const nameRegex = /^[a-zA-Z\s]{2,30}$/;
  const nameRegex = /^[A-Z][a-zA-Z\s]{1,29}$/;
  return nameRegex.test(name);
};

// Validates username with small letters, numbers, dots and underscores, length 3-20
export const validateUsername = (username) => {
  const usernameRegex = /^[a-z0-9._]{3,20}$/;
  return usernameRegex.test(username);
};

// Validates standard email format with @ and domain
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validates password with at least 8 chars, must include letter, number and special char, no whitespace allowed
export const validatePassword = (password) => {
  const passwordRegex =
    /^(?=.*[!@#$%^&])(?=.*[0-9])(?!.*\s)[A-Z][a-z\d!@#$%^&]{7,}$/;
  return passwordRegex.test(password);
};

// Validates international phone numbers with 10-15 digits, optional + prefix
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?[0-9]\d{9,14}$/;
  return phoneRegex.test(phoneNumber);
};

// Validates address with alphanumeric chars, spaces, commas, periods, hyphens and #, length 5-100
export const validateAddress = (address) => {
  const addressRegex = /^[A-Z][a-zA-Z0-9\s,.#-]{5,100}$/;
  return addressRegex.test(address);
};

// Validates organization name with letters, numbers, spaces and business identifiers, length 2-50
export const validateOrganization = (organization) => {
  const organizationRegex = /^[A-Z][a-zA-Z0-9\s&.,'-]{2,50}$/;
  return organizationRegex.test(organization);
};

// Validates avatar image file type and size
export const validateAvatar = (file) => {
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB max size

  return {
    isValid: validTypes.includes(file.type) && file.size <= maxSize,
    maxSize: maxSize,
    validTypes: validTypes,
  };
};

// Validates URLs with common protocols
export const validateUrl = (url) => {
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return urlRegex.test(url);
};

// Validates protocol (HTTP/HTTPS)
export const validateProtocol = (protocol) => {
  const protocolRegex = /^(HTTP|HTTPS)$/i;
  return protocolRegex.test(protocol);
};

// Validates IP addresses (both IPv4 and IPv6)
export const validateIP = (ip) => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Validates IP prototype (IPv4/IPv6)
export const validatePrototype = (prototype) => {
  const prototypeRegex = /^(IPv4|IPv6)$/i;
  return prototypeRegex.test(prototype);
};

// Validates license ID format
export const validateLicenseId = (licenseId) => {
  const licenseIdRegex = /^[A-Z][a-zA-Z0-9-]{3,30}$/;
  return licenseIdRegex.test(licenseId);
};

// Validates organization name for license
export const validateLicenseOrganization = (organization) => {
  const organizationRegex = /^[A-Z][a-zA-Z0-9\s&.,'-]{2,50}$/;
  return organizationRegex.test(organization);
};

// Validates license dates and times
export const validateValidFromDate = (validFrom) => {
  if (!validFrom) {
    return { isValid: false, message: "Start date is required" };
  }

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date instanceof Date &&
      !isNaN(date) &&
      date.toISOString().split("T")[0] === dateString
    );
  };

  if (!isValidDate(validFrom)) {
    return { isValid: false, message: "Please enter a valid date" };
  }

  const validFromDateTime = new Date(`${validFrom}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (validFromDateTime < now) {
    return {
      isValid: false,
      message: "Valid from date must be today or in the future",
    };
  }

  return { isValid: true, message: "" };
};

export const validateValidTillDate = (validFrom, validTill) => {
  if (!validTill) {
    return { isValid: false, message: "End date is required" };
  }

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date instanceof Date &&
      !isNaN(date) &&
      date.toISOString().split("T")[0] === dateString
    );
  };

  if (!isValidDate(validTill)) {
    return { isValid: false, message: "Please enter a valid date" };
  }

  const validFromDateTime = new Date(`${validFrom}T00:00:00`);
  const validTillDateTime = new Date(`${validTill}T23:59:59`);

  if (validTillDateTime <= validFromDateTime) {
    return {
      isValid: false,
      message: "Valid till date must be after valid from date",
    };
  }

  return { isValid: true, message: "" };
};
