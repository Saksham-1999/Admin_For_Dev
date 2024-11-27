import React, { useState, useEffect } from "react";
import { FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchLicenses, reserveLicense } from "../../Api/api";
import Table3 from "../../components/Tables/Table3";
import LicenseTypeModal from "../../components/popup/CreateLicense/LicenseTypeModal";
import CreateMultipleLicenses from "../../components/popup/CreateLicense/CreateMultipleLicenses";
import CreateSingleLicense from "../../components/popup/CreateLicense/CreateSingleLicense";

function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [licenseModalType, setLicenseModalType] = useState(null);

  const columns = [
    { Header: "License ID", accessor: "license_id" },
    { Header: "Email", accessor: "allocated_to" },
    { Header: "Organisation", accessor: "organisation" },
    { Header: "Validity From", accessor: "valid_from" },
    { Header: "Validity Till", accessor: "valid_till" },
    { Header: "Status", accessor: "statusText" },
    // { Header: "Plugin ID", accessor: "plugin_id" },
    {
      Header: "Actions",
      accessor: "actions",
      cell: (row, onAction) => (
        <button
          onClick={() => onAction(row.license_id, "toggle")}
          className={` rounded ${
            row?.is_reserved // Safely check if is_reserved exists
              ? "text-green-600 hover:text-green-800"
              : "text-red-600 hover:text-red-800"
          }`}
          title={`${row?.is_reserved ? "Unreserve" : "Reserve"}`}
        >
          {row?.is_reserved ? (
            <FaToggleOn size={25} />
          ) : (
            <FaToggleOff size={25} />
          )}
        </button>
      ),
    },
  ];

  const processLicenses = (licenses) => {
    return licenses.map((license) => ({
      ...license,
      plugin_id: license?.plugins[0]?.plugin_id || "N/A",
      allocated_to: license?.allocated_to || "N/A",
      statusText: license?.status === "1" ? "Active" : "Inactive",
      is_reserved: license?.is_reserved || false,
    }));
  };

  const getLicenses = async () => {
    try {
      const response = await fetchLicenses();
      if (response.ok) {
        const data = await response.json();
        setLicenses(processLicenses(data));
        setLoading(false);
      } else {
        setError("Server response not Ok!");
        setLoading(false);
        toast.warning("Server response not OK!.");
      }
    } catch (error) {
      console.error("Error fetching licenses:", error);
      // const dummyLicenses = generateDummyLicenses(5);
      // setLicenses(processLicenses(dummyLicenses));
      setLoading(false);
      toast.error(`API error: ${error.message}`);
      setError(`API error: ${error.message}`);
    }
  };

  useEffect(() => {
    getLicenses();
  }, []);

  const handleAction = async (id, action, setUpdatingRow) => {
    if (action === "toggle") {
      try {
        setUpdatingRow(id);
        const currentLicense = licenses.find(
          (license) => license.license_id === id
        );

        // Check if the license is already allocated and prevent reservation
        if (currentLicense?.allocated_to !== "N/A") {
          toast.warn(`Allocated license ${id} can't be reserved.`);
          setUpdatingRow(null);
          return;
        }

        // Safeguard is_reserved field
        const isReserved = currentLicense?.is_reserved ? "0" : "1";

        const response = await reserveLicense(id, isReserved);
        const data = await response.json();

        if (response.ok) {
          setLicenses((prevLicenses) =>
            prevLicenses.map((license) => {
              if (license?.license_id === id) {
                return {
                  ...license,
                  is_reserved: data?.license?.is_reserved,
                };
              }
              return license;
            })
          );
          if (data?.license?.is_reserved) {
            toast.success(`License ${id} has been reserved successfully.`);
          } else {
            toast.info(`License ${id} has been unreserved.`);
          }
        } else {
          throw new Error(
            data?.message || "Failed to update license reservation."
          );
        }
      } catch (error) {
        console.error("Error updating license reservation:", error);
        toast.error(`Failed to update license reservation: ${error.message}`);
      } finally {
        setUpdatingRow(null);
      }
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-secondary-foreground tracking-widest">
            License Management
          </h1>
          <button
            onClick={() => setLicenseModalType("selection")}
            className="bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition duration-300 flex items-center"
          >
            <FaPlus className="mr-2" />
            Add License
          </button>
        </div>
        <Table3
          data={licenses}
          columns={columns}
          onAction={handleAction}
          loading={loading}
          error={error}
        />
      </div>
      {licenseModalType === "selection" && (
        <LicenseTypeModal
          onSelect={(type) => {
            setLicenseModalType(type);
          }}
          onClose={() => setLicenseModalType(null)}
        />
      )}
      {licenseModalType === "single" && (
        <CreateSingleLicense
          setShowForm={() => setLicenseModalType(null)}
          getLicenses={getLicenses}
        />
      )}
      {licenseModalType === "multiple" && (
        <CreateMultipleLicenses
          setShowForm={() => setLicenseModalType(null)}
          getLicenses={getLicenses}
        />
      )}
    </>
  );
}

export default Licenses;
