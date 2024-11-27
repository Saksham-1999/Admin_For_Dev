import React, { useEffect, useState } from "react";
import Table2 from "../components/Tables/Table2";
import {
  addDisputeComment,
  fetchDisputes,
  updateDisputeStatus,
} from "../Api/api";
import { toast } from "react-toastify";

function Disputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { Header: "Sr. No.", accessor: "sr_no" },
    { Header: "Receiver's Email", accessor: "recievers_email" },
    { Header: "Sender's Email", accessor: "senders_email" },
    { Header: "Subject", accessor: "subject" },
    { Header: "Counter", accessor: "max_counter" },
    { Header: "Status", accessor: "status" },
    { Header: "Comments", accessor: "comments" },
    { Header: "Created At", accessor: "created_at" },
    { Header: "Updated At", accessor: "updated_at" },
  ];

  useEffect(() => {
    const getDisputes = async () => {
      try {
        const response = await fetchDisputes();
        if (response.ok) {
          const result = await response.json();
          setDisputes(result);
        } else {
          toast.error("Failed to fetch disputes");
          setError("Failed to fetch disputes");
        }
      } catch (err) {
        toast.error("Error fetching disputes: " + err.message);
        setError("Error fetching disputes: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    getDisputes();
  }, []);

  const handleStatusChange = async (dispute_id, newStatus) => {
    try {
      const response = await updateDisputeStatus(dispute_id, newStatus);
      const data = await response.json();

      if (response.ok) {
        setDisputes((prevDisputes) =>
          prevDisputes.map((dispute) =>
            dispute.dispute_id === dispute_id
              ? { ...dispute, status: data.status }
              : dispute
          )
        );
        toast.success("Status updated successfully!");

        // Refresh the disputes list
        const refreshResponse = await fetchDisputes();
        if (refreshResponse.ok) {
          const result = await refreshResponse.json();
          setDisputes(result);
        }
      } else {
        toast.error(data.message || "Failed to update status");
        return;
      }
    } catch (error) {
      toast.error("Network error while updating status");
      return;
    }
  };

  const handleCommentAdd = async (dispute_id, comment) => {
    try {
      const response = await addDisputeComment(dispute_id, comment);
      if (response.ok) {
        const updatedData = await response.json();
        setDisputes((prevDisputes) =>
          prevDisputes?.map((dispute) =>
            dispute?.dispute_id === dispute_id
              ? { ...dispute, admin_comment: updatedData?.admin_comment }
              : dispute
          )
        );
        toast.success("Comment added successfully!");
      } else {
        toast.error("Failed to add comment");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <h1 className="text-3xl font-semibold text-secondary-foreground tracking-widest">
        Disputes
      </h1>
      <Table2
        data={disputes}
        onStatusChange={handleStatusChange}
        onCommentAdd={handleCommentAdd}
        columns={columns}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default Disputes;
