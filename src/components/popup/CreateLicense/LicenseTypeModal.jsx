import React from "react";
import { Close } from "@mui/icons-material";

function LicenseTypeModal({ onSelect, onClose }) {
  return (
    <div className="w-full h-screen flex items-center justify-center fixed inset-0 z-50 bg-black bg-opacity-80">
      <div className="w-96 bg-background dark:bg-gray-800 shadow rounded-lg p-6 relative">
        <Close
          className="absolute top-2 right-2 cursor-pointer text-gray-500"
          onClick={onClose}
        />
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Select License Creation Type
        </h2>
        <div className="space-y-4">
          <button
            onClick={() => onSelect("single")}
            className="w-full py-3 px-4 bg-primary hover:bg-secondary text-white rounded-lg transition duration-300"
          >
            Create Single License
          </button>
          <button
            onClick={() => onSelect("multiple")}
            className="w-full py-3 px-4 bg-primary hover:bg-secondary text-white rounded-lg transition duration-300"
          >
            Create Multiple Licenses
          </button>
        </div>
      </div>
    </div>
  );
}

export default LicenseTypeModal;
