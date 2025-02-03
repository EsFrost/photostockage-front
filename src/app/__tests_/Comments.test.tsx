import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Comments } from "@/app/components/Comments";

// Mock data
const mockComments = [
  {
    id: "1",
    content: "Test comment 1",
    id_user: "user1",
    username: "User One",
    user_icon: "/path/to/icon1.jpg",
    email: "user1@example.com",
  },
  {
    id: "2",
    content: "Test comment 2",
    id_user: "user2",
    username: "User Two",
    user_icon: null,
    email: "user2@example.com",
  },
];

const mockUsers = [
  {
    id: "user1",
    username: "User One",
    user_icon: "/path/to/icon1.jpg",
    email: "user1@example.com",
  },
  {
    id: "user2",
    username: "User Two",
    user_icon: null,
    email: "user2@example.com",
  },
];

describe("Comments Component", () => {
  const mockPhotoId = "photo123";

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    localStorage.clear();

    // Reset fetch mock
    global.fetch = jest.fn();

    // Mock localStorage
    Storage.prototype.getItem = jest.fn();

    // Spy on console.error and prevent it from actually logging
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("renders loading state initially", async () => {
    global.fetch = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    ) as jest.Mock;

    render(<Comments photo_id={mockPhotoId} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders comments when data is loaded", async () => {
    // Mock both API calls
    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockComments),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUsers),
        })
      ) as jest.Mock;

    await act(async () => {
      render(<Comments photo_id={mockPhotoId} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Test comment 1")).toBeInTheDocument();
      expect(screen.getByText("Test comment 2")).toBeInTheDocument();
    });
  });

  it("shows error message when fetch fails", async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("Failed to fetch data")) as jest.Mock;

    await act(async () => {
      render(<Comments photo_id={mockPhotoId} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
    });
  });

  it("shows login message for unauthenticated users", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockComments),
      })
    ) as jest.Mock;

    (localStorage.getItem as jest.Mock).mockReturnValue(null);

    await act(async () => {
      render(<Comments photo_id={mockPhotoId} />);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Please log in to leave a comment/i)
      ).toBeInTheDocument();
    });
  });

  it("shows comment form for authenticated users", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockComments),
      })
    ) as jest.Mock;

    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === "isLoggedIn") return "true";
      if (key === "tokenExpires") return String(Date.now() + 3600000);
      return null;
    });

    await act(async () => {
      render(<Comments photo_id={mockPhotoId} />);
    });

    await waitFor(() => {
      const submitButton = screen.getByText(/Submit Comment/i);
      expect(submitButton).toBeInTheDocument();
    });
  });

  it("renders alternating comment styles", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockComments),
      })
    ) as jest.Mock;

    await act(async () => {
      render(<Comments photo_id={mockPhotoId} />);
    });

    await waitFor(() => {
      const commentDivs = document.querySelectorAll(
        'div[class*="bg-[#6366F1]"]'
      );
      expect(commentDivs.length).toBe(1);
    });
  });

  it("handles periodic refresh", async () => {
    const fetchMock = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockComments),
      })
    ) as jest.Mock;

    global.fetch = fetchMock;

    // Set interval spy
    const setIntervalSpy = jest.spyOn(window, "setInterval");

    render(<Comments photo_id={mockPhotoId} />);

    await act(async () => {
      await Promise.resolve();
    });

    // Verify setInterval was called with correct interval
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    setIntervalSpy.mockRestore();
  });
});
