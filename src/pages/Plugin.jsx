import React, { useEffect, useState } from "react";
import Table from "../components/Tables/Table";
import { fetchLicenses } from "../Api/api";
import { toast } from "react-toastify";

function Plugin() {
  const [licenseData, setLicenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLicensesData = async () => {
    try {
      const response = await fetchLicenses();
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const result = await response.json();
      if (result) {
        setLicenseData(result);
      } else if (result.length === 0) {
        setError("No data available!");
        toast.info("No data available!");
      } else {
        setError("Server response not Ok!");
        toast.warn("Server response not Ok!");
      }
    } catch (error) {
      console.error("Failed to load license data:", error);
      // const dummyData = generateDummyLicenses(10); 
      // setLicenseData(dummyData);
      toast.error(`API error: ${error.message}`);
      setError(`API error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLicensesData();
  }, []);

  const tabData = [
    {
      label: "Available License",
      headers: [
        "Sr. No.",
        "License ID",
        // "Plugin ID",
        // "Email",
        "Validity From",
        "Validity Till",
        // "Status",
        "Issue",
      ],
      data: licenseData
        ?.filter(
          (item) =>
            !item.allocated_to && (!item.plugins || item.plugins.length === 0)
        )
        ?.map((item, index) => ({
          sr_no: index + 1,
          license_id: item?.license_id,
          // plugin_id: item?.plugins[0]?.plugin_id,
          // email: item?.allocated_to,
          validity_from: item?.valid_from,
          validity_till: item?.valid_till,
          status: item?.status === "0" ? "Inactive" : "Active",
          is_reserved: item?.is_reserved,
          issue: item?.status,
        })),
    },
    {
      label: "Plugin Installed",
      headers: [
        "Sr. No.",
        "License ID",
        "Email",
        "Validity From",
        "Validity Till",
        // "Plugin ID",
        "Issue",
      ],
      data: licenseData
        ?.filter(
          (item) =>
            item.allocated_to &&
            item.plugins &&
            item.plugins.length > 0 &&
            item.plugins[0].plugin_id
        )
        ?.map((item, index) => ({
          sr_no: index + 1,
          license_id: item?.license_id,
          email: item?.allocated_to,
          validity_from: item?.valid_from,
          validity_till: item?.valid_till,
          // plugin_id: item?.plugins[0]?.plugin_id,
          issue: item?.status,
        })),
    },
    {
      label: "Plugin Not Installed",
      headers: [
        "Sr. No.",
        "License ID",
        // "Plugin ID",
        "Email",
        "Validity From",
        "Validity Till",
        "Issue",
      ],
      data: licenseData
        ?.filter(
          (item) =>
            item.allocated_to && (!item.plugins || item.plugins.length === 0)
        )
        ?.map((item, index) => ({
          sr_no: index + 1,
          license_id: item?.license_id,
          // plugin_id: item?.plugins[0]?.plugin_id,
          email: item?.allocated_to,
          validity_from: item?.valid_from,
          validity_till: item?.valid_till,
          issue: item?.status,
        })),
    },
    {
      label: "License Report",
      headers: [
        "Sr. No.",
        "License ID",
        "Email",
        "Validity From",
        "Validity Till",
        // "Plugin ID",
        "History",
      ],
      data: licenseData?.map((item, index) => ({
        sr_no: index + 1,
        license_id: item?.license_id,
        // plugin_id: item?.plugins[0]?.plugin_id,
        email: item?.allocated_to,
        validity_from: item?.valid_from,
        validity_till: item?.valid_till,
        issue: item?.status,
      })),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-5">
      <h1 className="text-3xl font-semibold text-secondary-foreground tracking-widest">
        Plugin Management
      </h1>
      <div className="">
        <Table
          tabData={tabData}
          loading={loading}
          setLoading={setLoading}
          error={error}
          fetchLicensesData={fetchLicensesData}
        />
      </div>
    </div>
  );
}

export default Plugin;
