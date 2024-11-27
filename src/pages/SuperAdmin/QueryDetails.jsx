import React, { useState, useEffect } from "react";
import Alert from "../../components/popup/Alert/Alert";

const dummyQueries = [
  {
    id: 1,
    subject: "Technical Integration Question",
    query_text:
      "How can I integrate your API with my existing system? Do you provide documentation?",
    status: "pending",
    created_at: "2024-01-15T11:20:00Z",
    admin_response: "",
  },
  {
    id: 2,
    subject: "Billing Inquiry",
    query_text:
      "I was charged twice for my last subscription payment. Please check and resolve.",
    status: "in-progress",
    created_at: "2024-01-14T16:30:00Z",
    admin_response:
      "We're currently investigating this issue with our billing department.",
  },
  {
    id: 3,
    subject: "Feature Request",
    query_text: "Would it be possible to add dark mode to the dashboard?",
    status: "resolved",
    created_at: "2024-01-13T09:45:00Z",
    admin_response:
      "Thank you for your suggestion. We've added this to our product roadmap.",
  },
];

const QueryDetails = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");

  useEffect(() => {
    setQueries(dummyQueries);
  }, []);

  const handleResponseSubmit = async (queryId) => {
    // Add response submission logic here
    // You'll need to create a new API endpoint for this
  };

  return (
    <div className="w-full">
      <Alert/>

      <h1 className="text-3xl font-semibold text-secondary-foreground tracking-widest">
        User Queries
      </h1>

      <div className="grid gap-6 mt-5">
        {queries.map((query) => (
          <div
            key={query.id}
            className="bg-background dark:bg-gray-800 rounded-lg shadow-md p-4"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-primary">
                  {query.subject}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {query.query_text}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Submitted: {new Date(query.created_at).toLocaleString()}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-primary mb-2">
                  Admin Response
                </h4>
                <textarea
                  value={
                    query.id === selectedQuery?.id
                      ? adminResponse
                      : query.admin_response || ""
                  }
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Type your response here..."
                  rows="3"
                  className="w-full p-2 border rounded focus:outline-primary dark:bg-gray-700 bg-gray-100 text-gray-600 dark:text-gray-300"
                />
                <button
                  onClick={() => handleResponseSubmit(query.id)}
                  className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-secondary"
                >
                  Send Response
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    query.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {query.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueryDetails;
