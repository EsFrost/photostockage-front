import React, { FC } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserTooltip from "@/app/components/UserTooltip";

// Define props type to match the component's props
interface UserTooltipProps {
  username: string;
  email: string;
  className?: string;
}

describe("UserTooltip Component", () => {
  const defaultProps: UserTooltipProps = {
    username: "testuser",
    email: "test@example.com",
  };

  it("renders username correctly", () => {
    render(<UserTooltip {...defaultProps} />);
    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  it("does not show tooltip by default", () => {
    render(<UserTooltip {...defaultProps} />);
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  it("shows tooltip on mouse enter", () => {
    render(<UserTooltip {...defaultProps} />);

    const usernameElement = screen.getByText("testuser");
    fireEvent.mouseEnter(usernameElement);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("hides tooltip on mouse leave", () => {
    render(<UserTooltip {...defaultProps} />);

    const usernameElement = screen.getByText("testuser");

    // Show tooltip
    fireEvent.mouseEnter(usernameElement);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();

    // Hide tooltip
    fireEvent.mouseLeave(usernameElement);
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-class";
    render(<UserTooltip {...defaultProps} className={customClass} />);

    const usernameElement = screen.getByText("testuser");
    expect(usernameElement).toHaveClass(customClass);
  });

  it("maintains hover state correctly", () => {
    render(<UserTooltip {...defaultProps} />);
    const usernameElement = screen.getByText("testuser");

    // Initial state
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();

    // Mouse enter
    fireEvent.mouseEnter(usernameElement);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();

    // Mouse leave
    fireEvent.mouseLeave(usernameElement);
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();

    // Mouse enter again
    fireEvent.mouseEnter(usernameElement);
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
