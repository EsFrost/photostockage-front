import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Save, X } from "lucide-react";
import { FaRegCircleUser } from "react-icons/fa6";

const AdminMyAccount = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    user_icon: "",
    access_level: 1,
  });

  const [formData, setFormData] = useState({
    username: "",
    user_icon: null as File | null,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState({
    username: "",
    user_icon: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          router.push("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/user/user/${userId}`,
          {
            credentials: "include",
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        const currentUser = userData[0];
        setUser(currentUser);
        setFormData((prev) => ({
          ...prev,
          username: currentUser.username,
        }));
        if (currentUser.user_icon) {
          setPreviewUrl(currentUser.user_icon);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          user_icon: "File size must be less than 8MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, user_icon: "File must be an image" }));
        return;
      }

      setFormData((prev) => ({ ...prev, user_icon: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, user_icon: "" }));
    }
  };

  const clearImageSelection = () => {
    setFormData((prev) => ({ ...prev, user_icon: null }));
    setPreviewUrl(user.user_icon || "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateUserForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePasswordForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!passwordData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpdateUser = async () => {
    if (!validateUserForm()) return;
    setIsLoading(true);
    try {
      let imagePath = user.user_icon;

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
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || "Failed to upload image");
        }

        imagePath = uploadResult.fileUrl;
      }

      const response = await fetch(
        `http://localhost:3000/user/changeuser/${user.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            user_icon: imagePath,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      setUpdateMessage("Profile updated successfully!");
      localStorage.setItem("user_icon", imagePath);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      setUpdateMessage("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) return;
    setIsPasswordLoading(true);
    try {
      const response = await fetch("http://localhost:3000/user/changepass", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          currentPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to change password");
      }

      setPasswordMessage("Password changed successfully!");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordMessage(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:3000/user/delete/${user.email}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to delete account");

      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("tokenExpires");
      localStorage.removeItem("userId");
      localStorage.removeItem("user_icon");
      window.dispatchEvent(new Event("logoutEvent"));
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">
          Administrator Profile
        </h2>

        {/* Profile Picture */}
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            {previewUrl ? (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Profile preview"
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
                <button
                  onClick={clearImageSelection}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <FaRegCircleUser className="w-24 h-24 text-gray-400" />
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100"
            >
              Change Profile Picture
            </button>
          </div>
          {errors.user_icon && (
            <p className="text-red-500 text-sm text-center">
              {errors.user_icon}
            </p>
          )}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, username: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
          />
        </div>

        {updateMessage && (
          <p
            className={`text-sm ${
              updateMessage.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {updateMessage}
          </p>
        )}

        <button
          onClick={handleUpdateUser}
          disabled={isLoading}
          className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Password Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-xl font-semibold border-b pb-2">Change Password</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  oldPassword: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.oldPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {passwordMessage && (
          <p
            className={`text-sm ${
              passwordMessage.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {passwordMessage}
          </p>
        )}

        <button
          onClick={handlePasswordChange}
          disabled={isPasswordLoading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPasswordLoading ? "Changing Password..." : "Change Password"}
        </button>
      </div>

      {/* Delete Account Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-red-600 border-b pb-2">
          Delete Account
        </h2>
        <p className="text-gray-600 my-4">
          Warning: Deleting your administrator account will remove all
          administrative privileges. Please ensure there is another
          administrator account before proceeding.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {isDeleting ? "Deleting Account..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
};

export default AdminMyAccount;
