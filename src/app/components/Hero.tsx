"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const tokenExpires = Number(localStorage.getItem("tokenExpires"));

      if (isLoggedIn && Date.now() > tokenExpires) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("tokenExpires");
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(isLoggedIn);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000);

    // Add listener for logout event
    window.addEventListener("logoutEvent", checkAuth);
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("logoutEvent", checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/user/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("tokenExpires");
        localStorage.removeItem("user_icon");
        setIsLoggedIn(false);
        router.push("/");
        window.dispatchEvent(new Event("logoutEvent"));
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <section className="text-gray-600 body-font px-2 sm:px-[2rem]">
      <div className="container mx-auto flex flex-col px-5 py-24 md:flex-row md:items-center">
        <div className="flex flex-col items-center text-center mb-16 md:mb-0 md:items-start md:text-left md:pr-24 md:flex-grow">
          <h1 className="title-font text-3xl mb-4 font-medium text-gray-900">
            Share your photos. Download photos for your next project
            <br className="inline-block" />
            Start here.
          </h1>
          <p className="mb-9 leading-relaxed">
            Do you have photos you want to share with others? Do you want to
            find photos to use for your next project? Are you tired of copyright
            protected material? Then this site is the place to be.
            {!isLoggedIn && " Start now by signing up or logging in."}
          </p>
          <div className="flex justify-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded text-lg"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/register">
                  <button className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                    Sign Up
                  </button>
                </Link>
                <Link href="/login">
                  <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">
                    Login
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <Image
            src="https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            width={0}
            height={0}
            alt="Picture"
            sizes="100vw"
            className="object-cover object-center rounded w-[720px] xl:w-[520px] 2xl:w-[480px] min-w-[420px] hidden md:block"
          />
        </div>
      </div>
    </section>
  );
};
