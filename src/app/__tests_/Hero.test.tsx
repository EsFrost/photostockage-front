import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Hero } from "@/app/components/Hero";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe("Hero Component", () => {
  beforeEach(() => {
    // Clear localStorage
    window.localStorage.clear();
    // Clear mocks
    jest.clearAllMocks();
  });

  it("renders main heading and description", () => {
    render(<Hero />);

    expect(screen.getByText(/Share your photos/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Do you have photos you want to share with others/i)
    ).toBeInTheDocument();
  });

  it("shows login and signup buttons when user is not authenticated", () => {
    localStorage.setItem("isLoggedIn", "false");
    render(<Hero />);

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("shows logout button when user is authenticated", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    render(<Hero />);

    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
    expect(screen.queryByText(/Sign Up/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
  });

  it("handles logout correctly", async () => {
    global.fetch = jest.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
      })
    ) as jest.Mock;

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    render(<Hero />);

    const logoutButton = screen.getByText(/Logout/i);
    await fireEvent.click(logoutButton);

    expect(localStorage.getItem("isLoggedIn")).toBeNull();
    expect(localStorage.getItem("tokenExpires")).toBeNull();
    expect(localStorage.getItem("user_icon")).toBeNull();
  });

  it("does not show authentication buttons when token is expired", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() - 1000)); // Expired token

    render(<Hero />);

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  it("displays the hero image on non-mobile screens", () => {
    render(<Hero />);

    const image = screen.getByAltText("Picture");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("hidden", "md:block");
  });
});
