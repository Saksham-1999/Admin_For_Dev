import React from "react";
import { FaPrint } from "react-icons/fa";

const EmailDetailsModal = ({ isOpen, onClose, emailData }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    const printContent = `
      Email Details
      -------------
      From: ${emailData.senders_email}
      To: ${emailData.receivers_email}
      Subject: ${emailData.subject}
      
      Body:
      ${emailData.email_body || "No content"}
      
      Attachments:
      ${
        emailData.attachments
          ?.map(
            (att) =>
              `- ${att.file_name} (Status: ${att.ai_status}${
                att.ai_remarks ? `, ${att.ai_remarks}` : ""
              })`
          )
          .join("\n") || "No attachments"
      }
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Email Details</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${printContent}</pre>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-secondary-foreground">
            Email Details
          </h3>
          <button
            onClick={handlePrint}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FaPrint />
            Print
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Sender:</label>
              <p>{emailData.senders_email}</p>
            </div>
            <div>
              <label className="font-semibold">Receiver:</label>
              <p>{emailData.receivers_email}</p>
            </div>
          </div>

          <div>
            <label className="font-semibold">Subject:</label>
            <p>{emailData.subject}</p>
          </div>

          <div>
            <label className="font-semibold">Email Body:</label>
            <p className="whitespace-pre-wrap">
              {emailData.email_body || "No content"}
            </p>
          </div>

          <div>
            <label className="font-semibold">Attachments:</label>
            {emailData.attachments?.length > 0 ? (
              <ul className="list-disc pl-5">
                {emailData.attachments.map((attachment, index) => (
                  <li key={index}>
                    {attachment.file_name} - Status: {attachment.ai_status}
                    {attachment.ai_remarks && ` (${attachment.ai_remarks})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attachments</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailDetailsModal;
