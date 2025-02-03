import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CookieConsent from "@/app/components/CookieConsent";

describe("CookieConsent Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    // Reset all mocks
    jest.clearAllMocks();
  });

  it("shows consent banner when no cookie consent is stored", () => {
    render(<CookieConsent />);

    expect(
      screen.getByText(/We use cookies solely to enhance/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/I Understand/i)).toBeInTheDocument();
  });

  it("hides consent banner when cookie consent is already stored", () => {
    localStorage.setItem("cookieConsent", "accepted");
    render(<CookieConsent />);

    expect(
      screen.queryByText(/We use cookies solely to enhance/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/I Understand/i)).not.toBeInTheDocument();
  });

  it("stores consent and hides banner when 'I Understand' is clicked", () => {
    render(<CookieConsent />);

    const acceptButton = screen.getByText(/I Understand/i);
    fireEvent.click(acceptButton);

    // Check if consent was stored
    expect(localStorage.getItem("cookieConsent")).toBe("accepted");

    // Check if banner is hidden
    expect(
      screen.queryByText(/We use cookies solely to enhance/i)
    ).not.toBeInTheDocument();
  });

  it("renders with correct styling classes", () => {
    render(<CookieConsent />);

    const banner = screen.getByRole("complementary");
    expect(banner).toHaveClass(
      "fixed",
      "bottom-0",
      "left-0",
      "right-0",
      "bg-white"
    );
  });

  it("displays correct cookie usage information", () => {
    render(<CookieConsent />);

    expect(screen.getByText(/never used for marketing/i)).toBeInTheDocument();
    expect(
      screen.getByText(/maintain your login session/i)
    ).toBeInTheDocument();
  });

  it("has accessible button with clear call to action", () => {
    render(<CookieConsent />);

    const button = screen.getByRole("button", { name: /I Understand/i });
    expect(button).toHaveClass("bg-indigo-500", "text-white");
  });

  it("uses localStorage correctly", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem");
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");

    render(<CookieConsent />);

    // Check if localStorage was checked during initial render
    expect(getItemSpy).toHaveBeenCalledWith("cookieConsent");

    // Click accept button
    fireEvent.click(screen.getByText(/I Understand/i));

    // Verify localStorage was updated
    expect(setItemSpy).toHaveBeenCalledWith("cookieConsent", "accepted");
  });
});
