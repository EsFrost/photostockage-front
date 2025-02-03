import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";

interface CommentWithDetails {
  id: string;
  content: string;
  id_photo: string;
  id_user: string;
  status: boolean;
  photo?: {
    name: string;
    path: string;
  };
  user?: {
    username: string;
    user_icon: string;
  };
}

const ITEMS_PER_PAGE = 10;

const AdminComments = () => {
  const [comments, setComments] = useState<CommentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentComments = comments.slice(startIndex, endIndex);

  const fetchComments = async () => {
    try {
      const commentsResponse = await fetch("http://localhost:3000/comments", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!commentsResponse.ok) {
        throw new Error("Failed to fetch comments");
      }

      const commentsData = await commentsResponse.json();

      const enrichedComments = await Promise.all(
        commentsData.map(async (comment: CommentWithDetails) => {
          const [photoResponse, userResponse] = await Promise.all([
            fetch(`http://localhost:3000/photos/photo/${comment.id_photo}`, {
              headers: { Accept: "application/json" },
            }),
            fetch(`http://localhost:3000/user/user/${comment.id_user}`, {
              headers: { Accept: "application/json" },
            }),
          ]);

          const photoData = await photoResponse.json();
          const userData = await userResponse.json();

          return {
            ...comment,
            photo: photoData,
            user: userData[0],
          };
        })
      );

      setComments(enrichedComments);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch comments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingId(commentId);
    try {
      const response = await fetch(
        `http://localhost:3000/comments/delete/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      await fetchComments();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete comment"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Loading comments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Comment Management
        </h2>
        <div className="text-sm text-gray-600">
          Total Comments: {comments.length}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {currentComments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 flex items-start space-x-6 hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                {comment.user?.user_icon ? (
                  <Image
                    src={comment.user.user_icon}
                    alt={`${comment.user.username}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <FaRegCircleUser className="w-10 h-10 text-gray-400" />
                )}
              </div>

              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {comment.user?.username}
                    </span>
                    <span className="text-gray-500 mx-2">commented on</span>
                    <Link
                      href={`/photo/${comment.id_photo}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      {comment.photo?.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deletingId === comment.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 text-gray-700">{comment.content}</div>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No comments found.
            </div>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? "bg-indigo-500 text-white"
                    : "border hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminComments;
