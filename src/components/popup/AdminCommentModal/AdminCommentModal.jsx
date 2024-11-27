import { useState } from "react";

const AdminCommentModal = ({ isOpen, onClose, onSubmit, statusChange }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(comment);
      setComment("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background dark:bg-gray-800 p-6 rounded-lg shadow-xl w-[400px] animate-in fade-in-0 zoom-in-95">
            <h3 className="text-lg font-semibold mb-4 text-secondary-foreground">
              {statusChange ? "Update Status & Comment" : "Add Admin Comment"}
            </h3>
            <textarea
              value={comment}
              required
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-500 rounded-md bg-background dark:bg-gray-800 text-secondary-foreground resize-none"
              placeholder="Enter your comment..."
              rows={4}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-destructive text-white hover:bg-destructive/80"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex gap-2 items-center px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCommentModal;
