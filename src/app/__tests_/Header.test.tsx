import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Header } from "@/app/components/Header";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock react-icons
jest.mock("react-icons/fa6", () => ({
  FaRegCircleUser: () => <div data-testid="user-icon">User Icon</div>,
}));

describe("Header Component", () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    // Reset mocks and localStorage
    jest.clearAllMocks();
    localStorage.clear();
    window.dispatchEvent = jest.fn();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn();
  });

  it("renders basic header elements", () => {
    render(<Header />);

    expect(screen.getByAltText("Site logo")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  it("shows login and signup buttons when not authenticated", () => {
    render(<Header />);

    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("shows logout button when authenticated", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    render(<Header />);

    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("handles logout correctly", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ ok: true })
    );

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));
    localStorage.setItem("user_icon", "/path/to/icon.jpg");
    localStorage.setItem("userId", "123");

    render(<Header />);

    const logoutButton = screen.getByText("Logout");
    await fireEvent.click(logoutButton);

    expect(localStorage.getItem("isLoggedIn")).toBeNull();
    expect(localStorage.getItem("tokenExpires")).toBeNull();
    expect(localStorage.getItem("user_icon")).toBeNull();
    expect(localStorage.getItem("userId")).toBeNull();
  });

  it("renders user icon when available", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));
    localStorage.setItem("user_icon", "/path/to/icon.jpg");

    render(<Header />);

    expect(screen.getByAltText("User icon")).toBeInTheDocument();
  });

  it("renders default user icon when no custom icon is set", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    render(<Header />);

    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
  });

  it("handles expired token correctly", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() - 1000));

    render(<Header />);

    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  it("handles authentication state changes", () => {
    const { rerender } = render(<Header />);

    // Initial unauthenticated state
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();

    // Update localStorage to simulate login
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    // Re-render with new props to force update
    rerender(<Header key="rerender" />);

    // Verify authenticated state
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Sign Up")).not.toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  it("handles failed logout gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Logout failed"))
    );

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    render(<Header />);

    const logoutButton = screen.getByText("Logout");
    await fireEvent.click(logoutButton);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Logout failed:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("navigates to dashboard when clicking user icon", async () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    render(<Header />);

    await waitFor(() => {
      const dashboardLink = screen.getByTestId("user-icon").closest("a");
      expect(dashboardLink).toHaveAttribute("href", "/dashboard");
    });
  });
});
