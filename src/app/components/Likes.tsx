"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FcLike } from "react-icons/fc";
import Link from "next/link";

export const Likes = ({ photo_id }: { photo_id: string }) => {
  const router = useRouter();
  const [likes, setLikes] = useState<{ count: string }[]>([]);
  const [liked, setLiked] = useState<{ hasLiked: boolean }>({
    hasLiked: false,
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const test = 1;

  useEffect(() => {
    const fetchData = async () => {
      if (!photo_id) return;

      try {
        // Check authentication with proper type handling
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const tokenExpires = localStorage.getItem("tokenExpires");
        const isAuthenticated =
          isLoggedIn === "true" &&
          tokenExpires &&
          Number(tokenExpires) > Date.now();

        setIsAuthenticated(Boolean(isAuthenticated));

        // Fetch likes count (this doesn't require auth)
        const likesResponse = await fetch(
          `http://localhost:3000/likes/likes/${photo_id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!likesResponse.ok) {
          throw new Error(`HTTP error! status: ${likesResponse.status}`);
        }

        const likesData = await likesResponse.json();
        setLikes(likesData);

        // Only check if user has liked when authenticated
        if (isAuthenticated) {
          const hasLikedResponse = await fetch(
            `http://localhost:3000/likes/check/${photo_id}`,
            {
              headers: {
                Accept: "application/json",
              },
              credentials: "include",
            }
          );

          if (!hasLikedResponse.ok) {
            throw new Error(`HTTP error! status: ${hasLikedResponse.status}`);
          }

          const hasLikedData = await hasLikedResponse.json();
          setLiked(hasLikedData);
        } else {
          // Reset liked status when not authenticated
          setLiked({ hasLiked: false });
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Storage event listener with proper type handling
    const handleStorageChange = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      const tokenExpires = localStorage.getItem("tokenExpires");
      const isAuthenticated =
        isLoggedIn === "true" &&
        tokenExpires &&
        Number(tokenExpires) > Date.now();

      setIsAuthenticated(Boolean(isAuthenticated));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [photo_id]);

  if (loading) {
    return <div># Likes</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleLikeUnlike = async () => {
    if (!isAuthenticated) {
      router.push("/login"); // Replace with your login route
      return;
    }

    if (liked.hasLiked) {
      try {
        const response = await fetch(
          `http://localhost:3000/likes/like/${photo_id}`,
          {
            method: "DELETE",
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refetch likes after unliking
        const likesResponse = await fetch(
          `http://localhost:3000/likes/likes/${photo_id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!likesResponse.ok) {
          throw new Error(`HTTP error! status: ${likesResponse.status}`);
        }

        const likesData = await likesResponse.json();
        setLikes(likesData);
        setLiked({ hasLiked: false });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch likes."
        );
      }
    } else {
      try {
        const response = await fetch(
          `http://localhost:3000/likes/like/${photo_id}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Refetch likes after liking
        const likesResponse = await fetch(
          `http://localhost:3000/likes/likes/${photo_id}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!likesResponse.ok) {
          throw new Error(`HTTP error! status: ${likesResponse.status}`);
        }

        const likesData = await likesResponse.json();
        setLikes(likesData);
        setLiked({ hasLiked: true });
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch likes."
        );
      }
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="relative group cursor-pointer" onClick={handleLikeUnlike}>
        <FcLike
          className={`w-12 h-12 ${
            liked.hasLiked ? "opacity-100" : "opacity-30"
          } group-hover:opacity-100 duration-300 transition-all group-hover:scale-[1.2]`}
        />
      </div>

      {likes.length > 0 && likes[0].count === "1" ? (
        <p className="text-xl">{likes[0]?.count} Like</p>
      ) : (
        <p className="text-xl">{likes[0]?.count} Likes</p>
      )}
    </div>
  );
};
