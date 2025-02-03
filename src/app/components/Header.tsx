"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoFull from "../../../public/logo_full.png";
import { FaRegCircleUser } from "react-icons/fa6";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [user_icon, setuser_icon] = useState<string>("");

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const tokenExpires = Number(localStorage.getItem("tokenExpires"));
      const user_icon = localStorage.getItem("user_icon") || "";

      if (isLoggedIn && Date.now() > tokenExpires) {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("tokenExpires");
        localStorage.removeItem("user_icon");
        setIsLoggedIn(false);
        setuser_icon("");
      } else {
        setIsLoggedIn(isLoggedIn);
        setuser_icon(user_icon);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("logoutEvent", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("logoutEvent", checkAuth);
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
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
        router.push("/");
        window.dispatchEvent(new Event("logoutEvent"));
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-col items-center p-5 md:flex-row md:justify-between">
        <Link
          className="flex title-font font-medium items-center text-gray-900 justify-center"
          href="/"
        >
          <Image
            src={logoFull}
            width={0}
            height={0}
            sizes="100vw"
            alt="Site logo"
            className="max-w-[5rem] h-full"
          />
          <span className="hidden md:block text-xl">photoStockage</span>
        </Link>

        <nav className="flex flex-wrap items-center text-base mt-3 md:mt-0">
          <Link
            className="mr-5 hover:text-gray-900 bg-left-bottom bg-gradient-to-r from-[#4f46e5] to-[#d4d2f4] bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
            href="/"
          >
            Home
          </Link>
          <Link
            className="mr-5 hover:text-gray-900 bg-left-bottom bg-gradient-to-r from-[#4f46e5] to-[#d4d2f4] bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
            href="/about"
          >
            About
          </Link>
          <Link
            className="mr-5 hover:text-gray-900 bg-left-bottom bg-gradient-to-r from-[#4f46e5] to-[#d4d2f4] bg-[length:0%_2px] bg-no-repeat hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
            href="/contact"
          >
            Contact Us
          </Link>
        </nav>

        <div className="flex justify-end ml-0">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {user_icon ? (
                <Link href="/dashboard">
                  <Image
                    src={user_icon}
                    alt="User icon"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-full object-cover w-8 h-8"
                  />
                </Link>
              ) : (
                <Link href="/dashboard">
                  <FaRegCircleUser className="w-8 h-8 text-gray-600" />
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center bg-red-500 text-white border-0 py-1 px-3 focus:outline-none hover:bg-red-600 rounded text-base mt-3 md:mt-0"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/register">
                <button className="inline-flex items-center text-white bg-indigo-500 border-0 py-1 px-3 focus:outline-none hover:bg-indigo-600 rounded text-base mt-3 md:mt-0">
                  Sign Up
                </button>
              </Link>
              <Link href="/login">
                <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-3 md:mt-0 ml-5 text-inherit">
                  Login
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
