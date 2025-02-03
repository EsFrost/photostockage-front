"use client";
import React, { useEffect, useState } from "react";

const CookieConsent = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowModal(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
      role="complementary"
    >
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-4">
            <p className="text-gray-600">
              We use cookies solely to enhance your browsing experience and
              maintain your login session. These cookies are essential for the
              website to function properly and are never used for marketing,
              tracking, or any other purpose.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={acceptCookies}
              className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition-colors whitespace-nowrap"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
