import React, { useState, useEffect } from "react";
import Alert from "../../components/popup/Alert/Alert";

const dummyContacts = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    message:
      "I need assistance with your enterprise solutions. Please contact me at your earliest convenience.",
    status: "pending",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    message: "Having issues with the login system. Could you please help?",
    status: "in-progress",
    created_at: "2024-01-14T15:45:00Z",
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.wilson@example.com",
    message:
      "Interested in your premium package. What are the features included?",
    status: "resolved",
    created_at: "2024-01-13T09:20:00Z",
  },
];

const ContactDetails = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    setContacts(dummyContacts);
  }, []);

  const handleStatusChange = async (contactId, newStatus) => {
    // Add status update logic here
    // You'll need to create a new API endpoint for this
  };

  return (
    <div className="w-full">
      <Alert/>

      <h1 className="text-3xl font-semibold text-secondary-foreground tracking-widest">
        Contact Messages
      </h1>

      <div className="grid gap-6 mt-5">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-background dark:bg-gray-800 rounded-lg shadow-md p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-primary">
                  {contact.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {contact.email}
                </p>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {contact.message}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Received: {new Date(contact.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <select
                  value={contact.status}
                  onChange={(e) =>
                    handleStatusChange(contact.id, e.target.value)
                  }
                  className="border rounded p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactDetails;
