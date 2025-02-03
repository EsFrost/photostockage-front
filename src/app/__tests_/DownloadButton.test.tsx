import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DownloadButton from "@/app/components/DownloadButton";

describe("DownloadButton Component", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default state", () => {
    render(<DownloadButton onClick={mockOnClick} />);
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Download");
    expect(button).not.toBeDisabled();
  });

  it("shows loading state when isLoading is true", () => {
    render(<DownloadButton onClick={mockOnClick} isLoading={true} />);
    const button = screen.getByRole("button");

    expect(button).toHaveTextContent("Downloading...");
    expect(button).toBeDisabled();
  });

  it("calls onClick handler when clicked", () => {
    render(<DownloadButton onClick={mockOnClick} />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("doesn't call onClick handler when disabled", () => {
    render(<DownloadButton onClick={mockOnClick} isLoading={true} />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("has correct styling classes", () => {
    render(<DownloadButton onClick={mockOnClick} />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("bg-indigo-500");
    expect(button).toHaveClass("text-white");
  });

  it("contains download icon", () => {
    render(<DownloadButton onClick={mockOnClick} />);
    const icon = document.querySelector(".lucide-download");
    expect(icon).toBeInTheDocument();
  });

  it("applies disabled styling when loading", () => {
    render(<DownloadButton onClick={mockOnClick} isLoading={true} />);
    const button = screen.getByRole("button");

    expect(button).toHaveClass("disabled:opacity-50");
    expect(button).toHaveClass("disabled:cursor-not-allowed");
  });
});
