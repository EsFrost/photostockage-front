"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_icon: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_icon: "",
  });
  const [registrationError, setRegistrationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const tokenExpires = localStorage.getItem("tokenExpires");
      const isAuthenticated =
        isLoggedIn && tokenExpires && Number(tokenExpires) > Date.now();

      if (isAuthenticated) {
        router.push("/");
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (registrationError) {
      setRegistrationError("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          user_icon: "File size must be less than 5MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          user_icon: "File must be an image",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        user_icon: file,
      }));

      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setErrors((prev) => ({
        ...prev,
        user_icon: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      user_icon: "",
    };
    let isValid = true;

    if (!formData.username) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // User icon validation only if a file was selected
    if (formData.user_icon) {
      if (formData.user_icon.size > 5 * 1024 * 1024) {
        newErrors.user_icon = "File size must be less than 5MB";
        isValid = false;
      } else if (!formData.user_icon.type.startsWith("image/")) {
        newErrors.user_icon = "File must be an image";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearImageSelection = () => {
    setFormData((prev) => ({
      ...prev,
      user_icon: null,
    }));
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      let imagePath = "";
      if (formData.user_icon) {
        const fileData = new FormData();
        const fileIdentifier = crypto.randomUUID();
        fileData.append("file", formData.user_icon);
        fileData.append("identifier", fileIdentifier);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: fileData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(uploadResult.error || "Image upload failed");
        }

        imagePath = uploadResult.fileUrl;
      }

      const requestBody = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        user_icon: imagePath,
      };

      const response = await fetch(`http://localhost:3000/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      setRegistrationSuccess(true);
      setRegistrationError("");
    } catch (error) {
      console.error("Registration error:", error);
      setRegistrationError(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col px-0 sm:px-5 mx-auto w-full max-w-md">
      <section className="text-gray-600 body-font relative">
        <div className="container py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="text-3xl font-medium title-font mb-4 text-gray-900">
              Register
            </h1>
            <p className="mx-auto leading-relaxed text-base">
              {registrationSuccess
                ? "Registration successful! You can now proceed to login."
                : "Create your account to start sharing photos."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full px-4">
            <div className="flex flex-wrap -m-2">
              {/* Username field */}
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="username"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={registrationSuccess}
                    className={`w-full bg-gray-100 bg-opacity-50 rounded border 
                      ${errors.username ? "border-red-500" : "border-gray-300"}
                      focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 
                      text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors 
                      duration-200 ease-in-out disabled:opacity-50`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div className="p-2 w-full">
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
                    onChange={handleChange}
                    disabled={registrationSuccess}
                    className={`w-full bg-gray-100 bg-opacity-50 rounded border 
                      ${errors.email ? "border-red-500" : "border-gray-300"}
                      focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 
                      text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors 
                      duration-200 ease-in-out disabled:opacity-50`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Password field */}
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={registrationSuccess}
                    className={`w-full bg-gray-100 bg-opacity-50 rounded border 
                      ${errors.password ? "border-red-500" : "border-gray-300"}
                      focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 
                      text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors 
                      duration-200 ease-in-out disabled:opacity-50`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Password field */}
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={registrationSuccess}
                    className={`w-full bg-gray-100 bg-opacity-50 rounded border 
                      ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                      focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 
                      text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors 
                      duration-200 ease-in-out disabled:opacity-50`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* User Icon field */}
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="user_icon"
                    className="leading-7 text-sm text-gray-600"
                  >
                    Profile Picture (Optional) (8MB max)
                  </label>
                  <input
                    type="file"
                    id="user_icon"
                    name="user_icon"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={registrationSuccess}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-4">
                    {previewUrl && (
                      <>
                        <Image
                          src={previewUrl}
                          alt="Profile preview"
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearImageSelection}
                          disabled={registrationSuccess}
                          className="text-red-500 hover:text-red-700 font-semibold py-1 px-3 rounded disabled:opacity-50"
                        >
                          Remove Photo
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={registrationSuccess}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow disabled:opacity-50 mt-2"
                    >
                      Choose Profile Picture
                    </button>
                  </div>
                  {errors.user_icon && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.user_icon}
                    </p>
                  )}
                </div>
              </div>

              {registrationError && (
                <div className="p-2 w-full">
                  <p className="text-red-500 text-sm text-center">
                    {registrationError}
                  </p>
                </div>
              )}

              <div className="p-2 w-full">
                {registrationSuccess ? (
                  <Link href="/login">
                    <button
                      type="button"
                      className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                    >
                      Proceed to Login
                    </button>
                  </Link>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:opacity-50"
                  >
                    {isLoading ? "Registering..." : "Register"}
                  </button>
                )}
              </div>

              <div className="p-2 w-full text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-indigo-500 hover:text-indigo-600"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
