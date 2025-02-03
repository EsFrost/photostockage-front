import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BackToTopButton from "@/app/components/BackToTopButton";

describe("BackToTopButton Component", () => {
  const mockScrollTo = jest.fn();

  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = mockScrollTo;

    // Reset scroll position
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("is hidden by default when scroll position is at top", () => {
    render(<BackToTopButton />);
    const button = screen.getByRole("button", { hidden: true });
    expect(button).toHaveClass("opacity-0");
  });

  it("becomes visible when scrolling down past threshold", () => {
    render(<BackToTopButton />);

    // Simulate scrolling down
    Object.defineProperty(window, "scrollY", { value: 400 });
    fireEvent.scroll(window);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("opacity-100");
  });

  it("becomes hidden when scrolling back up", () => {
    render(<BackToTopButton />);

    // Scroll down first
    Object.defineProperty(window, "scrollY", { value: 400 });
    fireEvent.scroll(window);

    // Then scroll back up
    Object.defineProperty(window, "scrollY", { value: 200 });
    fireEvent.scroll(window);

    const button = screen.getByRole("button", { hidden: true });
    expect(button).toHaveClass("opacity-0");
  });

  it("calls window.scrollTo when clicked", () => {
    render(<BackToTopButton />);

    // Make button visible first
    Object.defineProperty(window, "scrollY", { value: 400 });
    fireEvent.scroll(window);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });
  });

  it("has correct accessibility attributes", () => {
    render(<BackToTopButton />);
    const button = screen.getByRole("button", { hidden: true });

    expect(button).toHaveAttribute("aria-label", "Back to top");
  });

  it("removes event listener on unmount", () => {
    const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
    const { unmount } = render(<BackToTopButton />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });
});
