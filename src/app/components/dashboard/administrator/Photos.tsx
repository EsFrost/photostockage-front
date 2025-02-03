import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
  id: string;
  user_id: string;
  name: string;
  description: string;
  path: string;
  status: boolean;
}

const ITEMS_PER_PAGE = 12;

const AdminPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(photos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPhotos = photos.slice(startIndex, endIndex);

  const fetchPhotos = async () => {
    try {
      const response = await fetch("http://localhost:3000/photos/admin", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch photos");
      }

      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch photos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleDelete = async (photoId: string) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) {
      return;
    }

    setDeletingId(photoId);
    try {
      const response = await fetch(
        `http://localhost:3000/photos/delete/${photoId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete photo");
      }

      await fetchPhotos();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete photo"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="text-center py-4">Loading photos...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Photo Management
        </h2>
        <div className="text-sm text-gray-600">
          Total Photos: {photos.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative h-48 w-full">
              <Link href={`/photo/${photo.id}`}>
                <Image
                  src={photo.path}
                  alt={photo.name}
                  fill
                  className="object-cover"
                />
              </Link>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {photo.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {photo.description}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(photo.id)}
                  disabled={deletingId === photo.id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  title="Delete photo"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    photo.status
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {photo.status ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="text-center text-gray-500 py-8">No photos found.</div>
      )}

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

export default AdminPhotos;
