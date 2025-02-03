"use client";
import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Upload,
  Users,
  MessageSquare,
  User,
  LogOut,
  Heart,
  Download,
  Plus,
  ChartBar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AddPhotoForm from "../components/dashboard/user/AddPhotoForm";
import { MyPhotos } from "../components/dashboard/user/MyPhotos";
import { Downloads } from "../components/dashboard/user/Downloads";
import MyComments from "../components/dashboard/user/MyComments";
import MyLikes from "../components/dashboard/user/MyLikes";
import MyAccount from "../components/dashboard/user/MyAccount";
import AdminMyAccount from "../components/dashboard/administrator/MyAccount";
import Categories from "../components/dashboard/administrator/Categories";
import AdminComments from "../components/dashboard/administrator/Comments";
import AdminUsers from "../components/dashboard/administrator/Users";
import AdminPhotos from "../components/dashboard/administrator/Photos";

// Menu configurations for different roles
const adminMenuOptions = [
  { id: "account", label: "My Account", icon: User, component: AdminMyAccount },
  { id: "photos", label: "Photos", icon: Upload, component: AdminPhotos },
  {
    id: "categories",
    label: "Categories",
    icon: ChartBar,
    component: Categories,
  },
  {
    id: "comments",
    label: "Comments",
    icon: MessageSquare,
    component: AdminComments,
  },
  { id: "users", label: "Users", icon: Users, component: AdminUsers },
  { id: "logout", label: "Logout", icon: LogOut, component: null },
];

const userMenuOptions = [
  { id: "account", label: "My Account", icon: User, component: MyAccount },
  { id: "addPhoto", label: "Add Photo", icon: Plus, component: AddPhotoForm },
  { id: "myPhotos", label: "My Photos", icon: Upload, component: MyPhotos },
  {
    id: "myComment",
    label: "My Comments",
    icon: MessageSquare,
    component: MyComments,
  },
  {
    id: "favorites",
    label: "My Likes",
    icon: Heart,
    component: MyLikes,
  },
  {
    id: "downloads",
    label: "My Downloads",
    icon: Download,
    component: Downloads,
  },
  { id: "logout", label: "Logout", icon: LogOut, component: null },
];

export default function Dashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const tokenExpires = localStorage.getItem("tokenExpires");
      const userId = localStorage.getItem("userId");
      const isAuthenticated =
        isLoggedIn && tokenExpires && Number(tokenExpires) > Date.now();

      if (!isAuthenticated || !userId) {
        router.push("/login");
        return;
      }

      try {
        const accessLevel = localStorage.getItem("access_level");
        const role = accessLevel === "true" ? "admin" : "user";
        setUserRole(role);

        const menuOptions =
          role === "admin" ? adminMenuOptions : userMenuOptions;
        setSelectedOption(menuOptions[0]);
      } catch (error) {
        console.error("Error checking authorization:", error);
        router.push("/login");
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("logoutEvent", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("logoutEvent", checkAuth);
    };
  }, [router]);

  const handleOptionClick = (option: (typeof adminMenuOptions)[0]) => {
    if (option.id === "logout") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("tokenExpires");
      localStorage.removeItem("user_icon");
      localStorage.removeItem("userId");
      router.push("/login");
      return;
    }

    // For direct menu clicks, just update component and reset URL
    router.push("/dashboard");
    setSelectedOption(option);
    setIsMenuOpen(false);
  };

  if (!userRole || !selectedOption) {
    return <div>Loading...</div>;
  }

  const menuOptions = userRole === "admin" ? adminMenuOptions : userMenuOptions;

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden fixed right-4 top-4 z-50 p-2 rounded-md hover:bg-gray-100"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay and Menu code stays the same */}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:block w-64 bg-white shadow-lg fixed top-0 left-0 z-50 overflow-y-auto lg:relative min-h-[100vh]`}
        >
          <nav className="mt-4">
            {menuOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2
                  ${
                    selectedOption.id === option.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700"
                  }
                `}
              >
                <option.icon className="w-5 h-5" />
                {option.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300
          ${isMenuOpen ? "blur-sm lg:blur-none" : ""} min-h-[100vh]`}
        >
          <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">
              {selectedOption.label}
            </h1>
            {selectedOption.component && <selectedOption.component />}
          </div>
        </main>
      </div>
    </div>
  );
}
