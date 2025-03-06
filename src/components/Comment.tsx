"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-toastify";

const Comment = ({
  comment,
  depth = 0,
  onReply,
}: {
  comment: any;
  depth: number;
  onReply: () => void;
}) => {
  const { user } = useUser();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = async () => {
    try {
      await axios.post("/api/reviews", {
        foodItemId: comment.foodItem,
        userId: user?.id,
        comment: replyText,
        parentReviewId: comment._id,
      });

      toast.success("Reply posted!");
      setReplyText("");
      setShowReplyForm(false);
      onReply(); // Trigger parent to refresh comments
    } catch (error) {
      toast.error("Failed to post reply");
    }
  };

  return (
    <div
      className={`ml-${depth * 8} mt-2 border-l-2 border-gray-700 pl-4`}
      style={{ marginLeft: `${depth * 2}rem` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <strong className="text-white">
          {comment.user.first_name} {comment.user.last_name}
        </strong>
        {comment.rating && (
          <span className="text-yellow-400">({comment.rating}/5)</span>
        )}
      </div>
      <p className="text-gray-300 text-sm mb-2">{comment.comment}</p>

      {depth < 5 && (
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-500 text-xs hover:text-blue-400"
        >
          Reply
        </button>
      )}

      {showReplyForm && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            className="w-full p-2 text-sm bg-gray-800 text-white rounded-md"
            rows={2}
          />
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleReply}
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Post Reply
            </button>
            <button
              onClick={() => setShowReplyForm(false)}
              className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {comment.replies?.map((reply: any) => (
        <Comment
          key={reply._id}
          comment={reply}
          depth={depth + 1}
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default Comment;
