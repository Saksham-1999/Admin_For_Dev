import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Table2 from "../components/Tables/Table2";
import { fetchPhishingMails } from "../Api/api";

function PhishingMails() {
  const [phishingMails, setPhishingMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const columns = [
    { Header: "Sr. No.", accessor: "sr_no" },
    // { Header: "ID", accessor: "id" },
    // { Header: "Message ID", accessor: "msg_id" },
    // { Header: "Plugin ID", accessor: "plugin_id" },
    // { Header: "User ID", accessor: "u_id" },
    { Header: "Sender's Email", accessor: "senders_email" },
    { Header: "Receiver's Email", accessor: "recievers_email" },
    // { Header: "CC", accessor: "cc" },
    // { Header: "BCC", accessor: "bcc" },
    { Header: "Subject", accessor: "subject" },
    { Header: "Created At", accessor: "create_time" },
    { Header: "EML File", accessor: "eml_file_name" },
    // { Header: "Status", accessor: "status" },
    // { Header: "URLs", accessor: "urls" },
    // { Header: "Attachments", accessor: "attachments" },
    // { Header: "IPv4", accessor: "ipv4" },
    // { Header: "Browser", accessor: "browser" },
    // { Header: "Email Body", accessor: "email_body" },
    // { Header: "CDR File", accessor: "cdr_file" },
  ];

  useEffect(() => {
    const getPhishingMails = async () => {
      setLoading(true);
      try {
        const response = await fetchPhishingMails();
        if (!response.ok) {
          throw new Error("Error fetching data");
        }
        const result = await response.json();

        if (result && result.email_details && result.email_details.length > 0) {
          setPhishingMails(result.email_details);
        } else {
          setError("No data available!");
          toast.info("No data available!");
        }
      } catch (error) {
        console.error("Error fetching phishing mails:", error);
        toast.error(`API error: ${error.message}`);
        setError(`API error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getPhishingMails();
  }, []);

  return (
    <div className="w-full flex flex-col gap-5">
      <h1 className="text-3xl font-semibold text-secondary-foreground tracking-widest">
        Phishing Mails
      </h1>
      <Table2
        data={phishingMails}
        columns={columns}
        loading={loading}
        error={error}
      />
    </div>
  );
}

export default PhishingMails;