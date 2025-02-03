import React from "react";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/app/components/Footer";

describe("Footer Component", () => {
  it("renders the logo and brand name", () => {
    render(<Footer />);

    expect(screen.getByText("photoStockage")).toBeInTheDocument();
    expect(screen.getByAltText("Site logo")).toBeInTheDocument();
  });

  it("displays the tagline", () => {
    render(<Footer />);

    expect(
      screen.getByText("Share your photos, share your experience")
    ).toBeInTheDocument();
  });

  it("renders all navigation links", () => {
    render(<Footer />);

    // Account section links
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();

    // Contact section links
    expect(
      screen.getByRole("link", { name: /for suggestions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /for questions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /contact us here/i })
    ).toBeInTheDocument();
  });

  it("renders social media icons with links", () => {
    render(<Footer />);

    // Get all SVG elements (social media icons)
    const socialIcons = document.querySelectorAll("svg");
    expect(socialIcons.length).toBe(4); // Facebook, Twitter, Instagram, LinkedIn
  });

  it("includes copyright information", () => {
    render(<Footer />);

    expect(screen.getByText(/© 2024 SigmundFrost/i)).toBeInTheDocument();
  });

  it("has correct section headings", () => {
    render(<Footer />);

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });
});
