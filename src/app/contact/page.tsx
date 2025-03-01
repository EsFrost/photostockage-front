"use client";
import React, { useState } from "react";
import Image from "next/image";
import logoFull from "../../../public/logo_full.png";
import Link from "next/link";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "contact",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus({ loading: false, success: true, error: "" });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-[100vh] flex flex-col px-0 sm:px-5 md:px-[5rem] mx-auto">
      <div
        className="flex flex-col items-center mt-[5rem] p-0 sm:p-10 md:flex-row md:items-stretch 
                    md:border-2 md:border-solid md:border-blue-900 md:outline md:outline-2 
                    md:outline-offset-[15px] md:outline-blue-900 relative"
      >
        <div className="w-full text-center md:w-1/3 md:pr-8">
          <Image
            src={logoFull}
            width={0}
            height={0}
            sizes="100vw"
            alt="Site logo"
            className="w-[5rem] h-auto pt-24 mb-4 mx-auto"
          />
          <p className="text-gray-600 leading-relaxed text-base">
            You can also contact us through email.
          </p>
          <p className="text-gray-600 leading-relaxed text-base">
            <span className="block lg:inline">Email:</span>{" "}
            <span className="break-all">photostockage@photostockage.com</span>
          </p>
          <p className="text-gray-600 leading-relaxed text-base">
            Or through our social media links that can be found{" "}
            <Link href="/">here</Link>
          </p>
        </div>

        <div className="hidden md:block absolute top-4 bottom-4 left-1/3 w-px bg-blue-900"></div>

        <div className="w-full md:w-2/3 md:pl-4">
          <section className="text-gray-600 body-font relative">
            <div className="container py-24 mx-auto">
              <div className="flex flex-col text-center w-full mb-12">
                <h1 className="text-3xl font-medium title-font mb-4 text-gray-900">
                  Contact Us
                </h1>
                <p className="mx-auto leading-relaxed text-base w-full sm:w-2/3">
                  For any questions you might have. For any suggestions. Or just
                  to chat with us.
                </p>
              </div>

              {status.success ? (
                <div className="text-center text-green-600 p-4">
                  <p>Thank you for your message! We'll get back to you soon.</p>
                  <button
                    onClick={() =>
                      setStatus({ loading: false, success: false, error: "" })
                    }
                    className="mt-4 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="w-full px-4 sm:w-1/2 sm:mx-auto"
                >
                  <div className="flex flex-wrap -m-2">
                    <div className="p-2 w-full sm:w-1/2">
                      <div className="relative">
                        <label
                          htmlFor="name"
                          className="leading-7 text-sm text-gray-600"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                      </div>
                    </div>
                    <div className="p-2 w-full sm:w-1/2">
                      <div className="relative">
                        <label
                          htmlFor="email"
                          className="leading-7 text-sm text-gray-600"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        />
                      </div>
                    </div>
                    <div className="p-2 w-full">
                      <div className="relative">
                        <label
                          htmlFor="message"
                          className="leading-7 text-sm text-gray-600"
                        >
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          required
                          className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                        ></textarea>
                      </div>
                    </div>
                    {status.error && (
                      <div className="p-2 w-full">
                        <p className="text-red-500 text-sm text-center">
                          {status.error}
                        </p>
                      </div>
                    )}
                    <div className="p-2 w-full">
                      <button
                        type="submit"
                        disabled={status.loading}
                        className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:opacity-50"
                      >
                        {status.loading ? "Sending..." : "Send message"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
