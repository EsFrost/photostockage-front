import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Likes } from "@/app/components/Likes";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock react-icons
jest.mock("react-icons/fc", () => ({
  FcLike: () => <div data-testid="like-icon">Like Icon</div>,
}));

describe("Likes Component", () => {
  const mockPhotoId = "test-photo-123";
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    localStorage.clear();

    // Setup router mock
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    // Mock fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders initial loading state", () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<Likes photo_id={mockPhotoId} />);
    expect(screen.getByText("# Likes")).toBeInTheDocument();
  });

  it("displays like count correctly", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ count: "5" }]),
      })
    );

    render(<Likes photo_id={mockPhotoId} />);

    await waitFor(() => {
      expect(screen.getByText("5 Likes")).toBeInTheDocument();
    });
  });

  it("handles singular like count", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ count: "1" }]),
      })
    );

    render(<Likes photo_id={mockPhotoId} />);

    await waitFor(() => {
      expect(screen.getByText("1 Like")).toBeInTheDocument();
    });
  });

  it("redirects to login when unauthenticated user tries to like", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ count: "0" }]),
      })
    );

    render(<Likes photo_id={mockPhotoId} />);

    const likeIcon = await screen.findByTestId("like-icon");
    fireEvent.click(likeIcon);

    expect(mockRouter.push).toHaveBeenCalledWith("/login");
  });

  it("toggles like when authenticated user clicks", async () => {
    // Mock authenticated state
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    // Mock initial likes fetch
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ count: "0" }]),
        })
      )
      // Mock hasLiked check
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ hasLiked: false }),
        })
      )
      // Mock like action
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        })
      )
      // Mock updated likes count
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ count: "1" }]),
        })
      );

    render(<Likes photo_id={mockPhotoId} />);

    const likeIcon = await screen.findByTestId("like-icon");
    fireEvent.click(likeIcon);

    await waitFor(() => {
      expect(screen.getByText("1 Like")).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("API Error"))
    );

    render(<Likes photo_id={mockPhotoId} />);

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  it("applies correct styling to like icon", async () => {
    // Mock authenticated state and liked status
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    (global.fetch as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ count: "1" }]),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ hasLiked: true }),
        })
      );

    render(<Likes photo_id={mockPhotoId} />);

    await waitFor(() => {
      const likeContainer = screen.getByTestId("like-icon").parentElement;
      // Check for the correct classes that are actually in the component
      expect(likeContainer).toHaveClass("relative");
      expect(likeContainer).toHaveClass("group");
      expect(likeContainer).toHaveClass("cursor-pointer");

      // Check parent wrapper
      const wrapper = likeContainer?.parentElement;
      expect(wrapper).toHaveClass("flex");
      expect(wrapper).toHaveClass("gap-2");
      expect(wrapper).toHaveClass("items-center");
    });
  });

  it("updates like count without page refresh", async () => {
    // Mock authenticated state
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("tokenExpires", String(Date.now() + 3600000));

    const fetchMock = jest
      .fn()
      // Initial likes count
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ count: "1" }]),
      })
      // Has liked check
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ hasLiked: false }),
      })
      // Like action
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      })
      // Updated likes count
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([{ count: "2" }]),
      });

    global.fetch = fetchMock;

    render(<Likes photo_id={mockPhotoId} />);

    // Initial state
    await waitFor(() => {
      expect(screen.getByText("1 Like")).toBeInTheDocument();
    });

    // Click like
    const likeIcon = await screen.findByTestId("like-icon");
    fireEvent.click(likeIcon);

    // Check updated state
    await waitFor(() => {
      expect(screen.getByText("2 Likes")).toBeInTheDocument();
    });
  });
});
