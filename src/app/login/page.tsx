"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
    // Clear field-specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear general login error when user makes any change
    if (loginError) {
      setLoginError("");
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };
    let isValid = true;

    if (!formData.email) {
      newErrors.email = "Email field cannot be empty";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password field cannot be empty";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Sanitize input data
  const sanitizeData = (data: typeof formData) => {
    return {
      email: data.email.toLowerCase().trim(),
      password: data.password.trim(),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(sanitizeData(formData)),
      });

      const loginData = await response.json();
      const token = loginData.token;
      const tokenParts = token.split(".");
      const payload = JSON.parse(atob(tokenParts[1]));

      // Fetch user data
      const userResponse = await fetch(
        `http://localhost:3000/user/user/${payload.id}`,
        {
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      const userData = await userResponse.json();
      const user = userData[0];

      const expiresIn = 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("tokenExpires", String(Date.now() + expiresIn));
      localStorage.setItem("userId", payload.id);
      localStorage.setItem("access_level", payload.access_level);
      localStorage.setItem("user_icon", user.user_icon || "");

      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error instanceof Error ? error.message : "Login failed");
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
              Login
            </h1>
            <p className="mx-auto leading-relaxed text-base">
              Welcome back! Please enter your credentials to access your
              account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full px-4">
            <div className="flex flex-wrap -m-2">
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
                    className={`w-full bg-gray-100 bg-opacity-50 rounded border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

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
                    className={`w-full bg-gray-100 bg-opacity-50 rounded border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {loginError && (
                <div className="p-2 w-full">
                  <p className="text-red-500 text-sm text-center">
                    {loginError}
                  </p>
                </div>
              )}

              <div className="p-2 w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>

              <div className="p-2 w-full text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-indigo-500 hover:text-indigo-600"
                  >
                    Sign up here
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
