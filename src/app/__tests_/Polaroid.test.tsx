import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Polaroid } from "@/app/components/Polaroid";

// Mock data
const mockPhotos = [
  {
    id: "1",
    name: "Test Photo 1",
    path: "/test/path1.jpg",
    description: "Test description 1",
    user_id: "user1",
    status: true,
  },
  {
    id: "2",
    name: "Test Photo 2",
    path: "/test/path2.jpg",
    description: "Test description 2",
    user_id: "user2",
    status: true,
  },
];

const mockCategories = [
  { id: "1", name: "Nature", description: "Nature photos" },
  { id: "2", name: "Urban", description: "Urban photos" },
];

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("Polaroid Component", () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", async () => {
    // Mock fetch to delay response
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(<Polaroid />);

    // Initial render should have no images
    expect(screen.queryByAltText("Test Photo 1")).not.toBeInTheDocument();
  });

  it("fetches and displays photos and categories", async () => {
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/photos/photos")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhotos),
        });
      } else if (url.includes("/categories")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
    });

    render(<Polaroid />);

    // Wait for photos to be displayed using alt text
    await waitFor(() => {
      expect(screen.getByAltText("Test Photo 1")).toBeInTheDocument();
      expect(screen.getByAltText("Test Photo 2")).toBeInTheDocument();
    });

    // Check polaroid captions
    const polaroids = document.querySelectorAll("[polaroid-caption]");
    expect(polaroids[0]).toHaveAttribute("polaroid-caption", "Test Photo 1");
    expect(polaroids[1]).toHaveAttribute("polaroid-caption", "Test Photo 2");

    // Check if category dropdown is populated
    const categorySelect = screen.getByRole("combobox");
    expect(categorySelect).toBeInTheDocument();
    expect(screen.getByText("All Categories")).toBeInTheDocument();
    expect(screen.getByText("Nature")).toBeInTheDocument();
    expect(screen.getByText("Urban")).toBeInTheDocument();
  });

  it("handles category filtering", async () => {
    // Mock initial data fetch
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhotos),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        })
      );

    render(<Polaroid />);

    // Wait for initial render using alt text
    await waitFor(() => {
      expect(screen.getByAltText("Test Photo 1")).toBeInTheDocument();
    });

    // Mock category filter response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([mockPhotos[0]]), // Return only first photo
      })
    );

    // Select a category
    const categorySelect = screen.getByRole("combobox");
    fireEvent.change(categorySelect, { target: { value: "1" } }); // Select "Nature"

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByAltText("Test Photo 1")).toBeInTheDocument();
      expect(screen.queryByAltText("Test Photo 2")).not.toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    // Mock failed API response
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    (global.fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

    render(<Polaroid />);

    // Wait for error to be handled
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching data:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it("creates correct image links", async () => {
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/photos/photos")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhotos),
        });
      } else if (url.includes("/categories")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
    });

    render(<Polaroid />);

    // Wait for component to render with data
    await waitFor(() => {
      const links = screen.getAllByRole("link");
      expect(links[0]).toHaveAttribute("href", "/photo/1");
      expect(links[1]).toHaveAttribute("href", "/photo/2");
    });
  });

  it("applies correct styling to photo containers", async () => {
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("/photos/photos")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPhotos),
        });
      } else if (url.includes("/categories")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
    });

    render(<Polaroid />);

    // Wait for photos to be displayed
    await waitFor(() => {
      const photoContainers = document.querySelectorAll("[polaroid-caption]");
      expect(photoContainers).toHaveLength(2);

      photoContainers.forEach((container) => {
        expect(container).toHaveAttribute("polaroid-caption");
        expect(container.className).toContain("shadow");
        expect(container.className).toContain("transition-all");
      });

      // Check image styling
      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        expect(img.className).toContain("opacity-50");
        expect(img.className).toContain("hover:opacity-100");
        expect(img.className).toContain("transition-all");
      });
    });
  });
});
