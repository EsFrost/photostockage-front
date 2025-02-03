import React from "react";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaHeart,
  FaComments,
} from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-[100vh] mx-auto px-4 md:px-8 max-w-4xl py-24">
      <h1 className="text-3xl font-medium text-gray-900 mb-8 text-center">
        About photoStockage
      </h1>

      <div className="mb-16 text-gray-600 text-lg text-center max-w-2xl mx-auto">
        <p>
          Hey there! Welcome to photoStockage, where sharing photos is as easy
          as it gets. We&apos;re all about creating a space where photographers
          and creative folks can come together to share their work, find
          inspiration, and grab amazing photos for their projects - all
          completely free.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Upload Feature */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaCloudUploadAlt className="text-indigo-500 text-4xl mr-4" />
            <h2 className="text-xl font-semibold text-gray-800">Easy Upload</h2>
          </div>
          <p className="text-gray-600">
            Just drag, drop, and you&apos;re done! Share your photos with our
            community in seconds.
          </p>
        </div>

        {/* Download Feature */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaDownload className="text-indigo-500 text-4xl mr-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              Free Downloads
            </h2>
          </div>
          <p className="text-gray-600">
            No subscription needed, no credit card required. All photos are free
            to download and use.
          </p>
        </div>

        {/* Community Feature */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FaUserGroup className="text-indigo-500 text-4xl mr-4" />
            <h2 className="text-xl font-semibold text-gray-800">
              Active Community
            </h2>
          </div>
          <p className="text-gray-600">
            Connect with fellow photographers and creators who share your
            passion for great images.
          </p>
        </div>

        {/* Interaction Feature */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="flex space-x-1 text-indigo-500 text-4xl mr-4">
              <FaHeart />
              <FaComments />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Show Some Love
            </h2>
          </div>
          <p className="text-gray-600">
            Like your favorite shots and leave comments to connect with
            photographers.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-8 rounded-lg text-center">
        <IoShareSocialSharp className="text-indigo-500 text-4xl mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Ready to dive in?
        </h2>
        <p className="text-gray-600 mb-6">
          Join our growing community of creative minds and start sharing your
          perspective with the world.
        </p>
        <Link href="/register">
          <button className="bg-indigo-500 text-white px-8 py-3 rounded-md hover:bg-indigo-600 transition-colors">
            Get Started
          </button>
        </Link>
      </div>

      <div className="mt-16 space-y-8">
        {/* Cookie Information */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Cookie Usage
          </h2>
          <div className="space-y-4 text-gray-600">
            <p className="font-semibold">Our Limited Cookie Usage:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold">Session Cookies:</span> These
                temporary cookies are essential for keeping you logged in during
                your visit and expire when you close your browser.
              </li>
              <li>
                <span className="font-semibold">Authentication Cookies:</span>{" "}
                These cookies remember your login status so you don&apos;t have
                to log in every time you visit our site.
              </li>
            </ul>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="font-semibold text-blue-900">Important Notice:</p>
              <p className="text-blue-900 mt-2">
                These cookies are used ONLY to enhance your experience on our
                site and will NEVER be used for marketing or any other purpose.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Legal Notice
          </h2>
          <div className="space-y-4 text-gray-600">
            <p>
              photoStockage is a platform that enables photo sharing between
              users. We do not claim ownership of any content uploaded by users.
            </p>
            <p className="font-semibold mt-4">Legal Disclaimer:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                photoStockage does not take any responsibility regarding the
                content of the photos uploaded to our platform.
              </li>
              <li>
                Users are solely responsible for the content they upload and
                share.
              </li>
              <li>
                photoStockage is not liable for any damages or consequences
                arising from the use or misuse of photos downloaded from our
                platform.
              </li>
              <li>
                By using this platform, users acknowledge that they have the
                necessary rights and permissions to upload and share their
                content.
              </li>
              <li>
                Users downloading content are responsible for ensuring their use
                complies with applicable laws and regulations.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
