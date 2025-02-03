import React from "react";
import Link from "next/link";
import Image from "next/image";
import logoFull from "../../../public/logo_full.png";

export const Footer = () => {
  return (
    <footer className="text-gray-600 body-font mt-8">
      <div className="container mx-auto flex flex-col items-center justify-center py-4 px-5 md:flex-row md:justify-between md:px-[5rem]">
        <div className="flex flex-col items-center md:items-start w-64">
          <Link
            className="flex title-font font-medium items-center text-gray-900"
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
            <span className="text-xl">photoStockage</span>
          </Link>
          <p className="mt-2 text-sm text-gray-500 text-center md:text-left md:pl-6">
            Share your photos, share your experience
          </p>
        </div>
        <div className="flex flex-col items-center mt-10 md:flex-row md:mt-0 md:items-start">
          <div className="flex flex-col items-center mb-10 md:items-start md:pl-20">
            <div className="px-0 sm:px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-wideset mb-3">
                Account
              </h2>
              <nav className="list-none mb-10 text-center md:text-left">
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-800 text-sm"
                    href="/login"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-800 text-sm"
                    href="/register"
                  >
                    Sign up
                  </Link>
                </li>
              </nav>
            </div>
          </div>

          <div className="flex flex-col items-center text-center md:text-left mb-10 md:items-start md:pl-20">
            <div className="px-0 sm:px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-wideset mb-3">
                Contact us
              </h2>
              <nav className="list-none mb-10 text-center md:text-left">
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-800 text-sm"
                    href="/contact"
                  >
                    For suggestions
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-800 text-sm"
                    href="/contact"
                  >
                    For questions
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-600 hover:text-gray-800 text-sm"
                    href="/contact"
                  >
                    Contact us here
                  </Link>
                </li>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="container mx-auto py-4 px-5">
          <div className="flex flex-col items-center sm:items-start md:flex-row md:justify-between">
            <div className="flex items-center">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © 2024 SigmundFrost —
              </p>
              <Link
                className="text-gray-500 text-sm text-center md:text-left"
                href="https://github.com/EsFrost"
              >
                &nbsp; @SigmundFrost
              </Link>
            </div>

            <div className="flex mt-3 md:mt-0">
              <span className="flex justify-center md:ml-auto md:justify-start">
                <Link
                  className="text-gray-500 hover:text-blue-900 transition-all duration-300"
                  href="/"
                >
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                  </svg>
                </Link>

                <Link
                  className="ml-3 text-gray-500 hover:text-blue-900 transition-all duration-300"
                  href="/"
                >
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                  </svg>
                </Link>

                <Link
                  className="ml-3 text-gray-500 hover:text-blue-900 transition-all duration-300"
                  href="/"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="20"
                      height="20"
                      x="2"
                      y="2"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                  </svg>
                </Link>

                <Link
                  className="ml-3 text-gray-500 hover:text-blue-900 transition-all duration-300"
                  href="/"
                >
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="0"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="none"
                      d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                    ></path>
                    <circle cx="4" cy="4" r="2" stroke="none"></circle>
                  </svg>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
