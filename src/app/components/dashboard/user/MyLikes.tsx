import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Photo } from "../../../utils/interfaces";

interface Like {
  id: string;
  id_photo: string;
  id_user: string;
}

const MyLikes = () => {
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedPhotos = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found");
        }

        // First fetch the likes list
        const likesResponse = await fetch(
          `http://localhost:3000/likes/user/${userId}`,
          {
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
          }
        );

        if (!likesResponse.ok) {
          throw new Error(`HTTP error! status: ${likesResponse.status}`);
        }

        const likes = await likesResponse.json();

        // Then fetch each photo's details
        const photoPromises = likes.map((like: Like) =>
          fetch(`http://localhost:3000/photos/photo/${like.id_photo}`, {
            headers: {
              Accept: "application/json",
            },
            credentials: "include",
          }).then((res) => res.json())
        );

        const photos = await Promise.all(photoPromises);
        // Filter out any photos that might be private or deleted
        const validPhotos = photos.filter(
          (photo: Photo) => photo && photo.status
        );
        setLikedPhotos(validPhotos);
      } catch (error) {
        console.error("Error fetching likes:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch likes"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLikedPhotos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!likedPhotos?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">
          You haven&apos;t liked any photos yet. Find some photos you love!
        </p>
        <Link
          href="/"
          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
        >
          Browse Photos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-around gap-[30px] mt-5 mx-2 md:mx-8">
      {likedPhotos.map((photo) => (
        <div
          key={photo.id}
          className="
            p-[15px] pb-[60px] 
            shadow-[5px_15px_15px_rgb(225,225,225)] 
            h-full relative
            hover:shadow-[-5px_15px_15px_rgb(225,225,225)] 
            hover:scale-[1.1] 
            transition-all duration-500 
            after:content-[attr(polaroid-caption)] 
            after:absolute after:bottom-0 after:left-0 
            after:w-full after:text-center 
            after:p-[10px] after:text-[30px]
            after:transition-all after:opacity-50 
            after:hover:opacity-100 after:duration-1000
            mx-auto
            border border-1 border-gray-100
          "
          polaroid-caption={photo.name}
        >
          <Link href={`/photo/${photo.id}`}>
            <Image
              src={photo.path}
              width={0}
              height={0}
              alt={photo.name}
              sizes="100vw"
              className="max-w-[250px] min-w-[250px] w-auto h-auto opacity-50 hover:opacity-100 transition-all duration-500 mx-auto"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MyLikes;
