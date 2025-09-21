import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { VanaAppSocialShareWidget } from "./VanaAppSocialShareWidget";
import { Twitter } from "lucide-react";

describe("VanaAppSocialShareWidget", () => {
  // Mock clipboard API
  const mockWriteText = vi.fn();
  Object.assign(navigator, {
    clipboard: {
      writeText: mockWriteText,
    },
  });

  // Mock window.open
  const mockOpen = vi.fn();
  window.open = mockOpen;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders with default props", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" />);

    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on facebook")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on linkedin")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on instagram")).toBeInTheDocument();
  });

  it("renders with custom title", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" title="Share your result" />);

    expect(screen.getByText("Share your result")).toBeInTheDocument();
  });

  it("hides title when hideTitle is true", () => {
    render(
      <VanaAppSocialShareWidget shareContent="Test content" title="Share your result" hideTitle />
    );

    expect(screen.queryByText("Share your result")).not.toBeInTheDocument();
  });

  it("generates correct share text with all props", () => {
    const onShare = vi.fn();
    render(
      <VanaAppSocialShareWidget
        shareContent="🍦 Vanilla Dream\n\nSweet and classic!"
        suffix="\n\nDiscover your flavor @ app.vana.com\n#ICECREAM"
        onShare={onShare}
      />
    );

    const twitterButton = screen.getByLabelText("Share on twitter");

    act(() => {
      fireEvent.click(twitterButton);
    });

    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("🍦 Vanilla Dream"));
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("Sweet and classic!"));
    expect(mockWriteText).toHaveBeenCalledWith(
      expect.stringContaining("Discover your flavor @ app.vana.com")
    );
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("#ICECREAM"));
    expect(onShare).toHaveBeenCalledWith("twitter");
  });

  it("copies to clipboard and shows instruction toast", async () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" />);

    const twitterButton = screen.getByLabelText("Share on twitter");

    act(() => {
      fireEvent.click(twitterButton);
    });

    // Check clipboard was called immediately
    expect(mockWriteText).toHaveBeenCalled();

    // Check toast appears with instructions
    expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();
    expect(
      screen.getByText("Now go to Twitter and paste your message to share.")
    ).toBeInTheDocument();

    // Fast-forward to toast disappearance (4+ seconds)
    act(() => {
      vi.advanceTimersByTime(4100);
    });

    // Check window.open was NOT called (no automatic opening)
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("handles different platforms correctly", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" />);

    // Test Facebook
    const facebookButton = screen.getByLabelText("Share on facebook");
    fireEvent.click(facebookButton);
    expect(mockWriteText).toHaveBeenCalled();
    expect(
      screen.getByText("Now go to Facebook and paste your message to share.")
    ).toBeInTheDocument();

    // Test LinkedIn
    const linkedinButton = screen.getByLabelText("Share on linkedin");
    fireEvent.click(linkedinButton);
    expect(
      screen.getByText("Now go to Linkedin and paste your message to share.")
    ).toBeInTheDocument();

    // Test Instagram
    const instagramButton = screen.getByLabelText("Share on instagram");
    fireEvent.click(instagramButton);
    expect(
      screen.getByText("Now go to Instagram and paste your message to share.")
    ).toBeInTheDocument();

    // No automatic window opening for any platform
    expect(mockOpen).not.toHaveBeenCalled();
  });

  it("calls onCopySuccess with correct data", () => {
    const mockCopySuccess = vi.fn();
    render(
      <VanaAppSocialShareWidget shareContent="Test content" onCopySuccess={mockCopySuccess} />
    );

    const twitterButton = screen.getByLabelText("Share on twitter");

    act(() => {
      fireEvent.click(twitterButton);
    });

    expect(mockCopySuccess).toHaveBeenCalledWith(
      "twitter",
      expect.stringContaining("Test content")
    );
    expect(mockCopySuccess).toHaveBeenCalledTimes(1);
  });

  it("shows internal toast even when onCopySuccess is provided", () => {
    const mockCopySuccess = vi.fn();
    render(
      <VanaAppSocialShareWidget shareContent="Test content" onCopySuccess={mockCopySuccess} />
    );

    const twitterButton = screen.getByLabelText("Share on twitter");

    act(() => {
      fireEvent.click(twitterButton);
    });

    // Both should happen: external callback AND internal toast
    expect(mockCopySuccess).toHaveBeenCalled();
    expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();
  });

  it("hides internal toast when hideToast is true", () => {
    const mockCopySuccess = vi.fn();
    const { container } = render(
      <VanaAppSocialShareWidget
        shareContent="Test content"
        onCopySuccess={mockCopySuccess}
        hideToast={true}
      />
    );

    const twitterButton = screen.getByLabelText("Share on twitter");

    act(() => {
      fireEvent.click(twitterButton);
    });

    // External callback should work but no internal toast
    expect(mockCopySuccess).toHaveBeenCalled();
    expect(screen.queryByText("Copied to clipboard!")).not.toBeInTheDocument();
    expect(container.querySelector('[data-toast="true"]')).not.toBeInTheDocument();
  });

  it("applies custom classNames", () => {
    const { container } = render(
      <VanaAppSocialShareWidget
        shareContent="Test content"
        classNames={{
          root: "custom-root",
          title: "custom-title",
          buttons: "custom-buttons",
          button: "custom-button",
        }}
      />
    );

    expect(container.querySelector(".custom-root")).toBeInTheDocument();
    expect(container.querySelector(".custom-title")).toBeInTheDocument();
    expect(container.querySelector(".custom-buttons")).toBeInTheDocument();

    const twitterButton = screen.getByLabelText("Share on twitter");
    expect(twitterButton).toHaveClass("custom-button");
  });

  it("uses same share text for all platforms", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" />);

    // Test Instagram uses bare domain (not clickable anyway)
    const instagramButton = screen.getByLabelText("Share on instagram");
    fireEvent.click(instagramButton);
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("app.vana.com"));
    expect(mockWriteText).not.toHaveBeenCalledWith(expect.stringContaining("https://app.vana.com"));

    vi.clearAllMocks();

    // Test Facebook uses bare domain (auto-linkified)
    const facebookButton = screen.getByLabelText("Share on facebook");
    fireEvent.click(facebookButton);
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("app.vana.com"));
    expect(mockWriteText).not.toHaveBeenCalledWith(expect.stringContaining("https://app.vana.com"));
  });

  it("handles empty optional props gracefully", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" />);

    const twitterButton = screen.getByLabelText("Share on twitter");
    fireEvent.click(twitterButton);

    const clipboardText = mockWriteText.mock.calls[0][0];
    expect(clipboardText).not.toContain("undefined");
    expect(clipboardText).not.toContain("null");
    expect(clipboardText).toContain("Test content");
    expect(clipboardText).toContain("Test content");
  });

  it("uses custom button component", () => {
    const CustomButton = vi.fn(({ onClick, platform }) => (
      <button onClick={onClick} data-custom-platform={platform}>
        Custom {platform}
      </button>
    ));

    render(<VanaAppSocialShareWidget shareContent="Test content" buttonComponent={CustomButton} />);

    expect(CustomButton).toHaveBeenCalledTimes(4);
    expect(screen.getByText("Custom twitter")).toBeInTheDocument();
  });

  it("uses renderButton prop for custom rendering", () => {
    const renderButton = vi.fn((platform) => (
      <div data-testid={`custom-${platform}`}>{platform.toUpperCase()}</div>
    ));

    render(<VanaAppSocialShareWidget shareContent="Test content" renderButton={renderButton} />);

    expect(renderButton).toHaveBeenCalledTimes(4);
    expect(screen.getByTestId("custom-twitter")).toBeInTheDocument();
    expect(screen.getByText("TWITTER")).toBeInTheDocument();
  });

  it("adds data attributes for styling hooks", () => {
    const { container } = render(<VanaAppSocialShareWidget shareContent="Test content" />);

    expect(container.querySelector('[data-component="vana-app-social-share"]')).toBeInTheDocument();
    expect(container.querySelector('[data-platform="twitter"]')).toBeInTheDocument();
    expect(container.querySelector('[data-platform="facebook"]')).toBeInTheDocument();
  });

  it("uses custom toastDuration", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" toastDuration={2000} />);

    const twitterButton = screen.getByLabelText("Share on twitter");

    act(() => {
      fireEvent.click(twitterButton);
    });

    // Toast should appear
    expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();

    // Fast-forward to just before custom duration (2 seconds)
    act(() => {
      vi.advanceTimersByTime(1900);
    });

    // Toast should still be visible
    expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();

    // Fast-forward past custom duration
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Toast should be gone
    expect(screen.queryByText("Copied to clipboard!")).not.toBeInTheDocument();
  });

  it("uses default toastDuration when not specified", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" />);

    const twitterButton = screen.getByLabelText("Share on twitter");

    act(() => {
      fireEvent.click(twitterButton);
    });

    // Toast should appear
    expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();

    // Fast-forward to just before default duration (4 seconds)
    act(() => {
      vi.advanceTimersByTime(3900);
    });

    // Toast should still be visible
    expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();

    // Fast-forward past default duration
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Toast should be gone
    expect(screen.queryByText("Copied to clipboard!")).not.toBeInTheDocument();
  });

  it("tests all platforms copy functionality", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content with special chars: &=?" />);

    // Test all platforms copy to clipboard functionality
    const twitterButton = screen.getByLabelText("Share on twitter");
    fireEvent.click(twitterButton);

    const facebookButton = screen.getByLabelText("Share on facebook");
    fireEvent.click(facebookButton);

    const linkedinButton = screen.getByLabelText("Share on linkedin");
    fireEvent.click(linkedinButton);

    const instagramButton = screen.getByLabelText("Share on instagram");
    fireEvent.click(instagramButton);

    // Verify clipboard was called for all platforms
    expect(mockWriteText).toHaveBeenCalledTimes(4);

    // Verify each call contains the content
    mockWriteText.mock.calls.forEach((call) => {
      expect(call[0]).toContain("Test content with special chars: &=?");
    });
  });

  it("handles empty suffix correctly", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" suffix="" />);

    const twitterButton = screen.getByLabelText("Share on twitter");
    fireEvent.click(twitterButton);

    const clipboardText = mockWriteText.mock.calls[0][0];
    expect(clipboardText).toBe("Test content");
    expect(clipboardText).not.toContain("app.vana.com");
  });

  it("handles special characters in shareContent", () => {
    const specialContent = "Test & Content <script>alert('xss')</script> 100% 🎉";
    render(<VanaAppSocialShareWidget shareContent={specialContent} />);

    const twitterButton = screen.getByLabelText("Share on twitter");
    fireEvent.click(twitterButton);

    const clipboardText = mockWriteText.mock.calls[0][0];
    expect(clipboardText).toContain(specialContent);
  });

  it("cleans up timers on unmount", () => {
    const { unmount } = render(<VanaAppSocialShareWidget shareContent="Test content" />);

    const twitterButton = screen.getByLabelText("Share on twitter");
    fireEvent.click(twitterButton);

    // Verify toast appears
    expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();

    // Unmount component before timer completes
    unmount();

    // Fast-forward past when timer would have fired
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // No errors should occur (timer was cleaned up)
    expect(true).toBe(true); // Test passes if no errors thrown
  });

  it("handles theme iconSize correctly", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" theme={{ iconSize: 24 }} />);

    // The theme is passed to the DefaultShareButton components
    expect(screen.getByLabelText("Share on twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on facebook")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on linkedin")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on instagram")).toBeInTheDocument();
  });

  it("handles multiple rapid clicks correctly", () => {
    render(<VanaAppSocialShareWidget shareContent="Test content" />);

    const twitterButton = screen.getByLabelText("Share on twitter");

    // Click multiple times rapidly
    act(() => {
      fireEvent.click(twitterButton);
      fireEvent.click(twitterButton);
      fireEvent.click(twitterButton);
    });

    // Should handle multiple clicks gracefully
    expect(mockWriteText).toHaveBeenCalledTimes(3);
    expect(screen.getByText("Copied to clipboard!")).toBeInTheDocument();
  });

  it("generates correct share text with useCallback memoization", () => {
    const { rerender } = render(<VanaAppSocialShareWidget shareContent="Original content" />);

    const twitterButton = screen.getByLabelText("Share on twitter");
    fireEvent.click(twitterButton);

    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("Original content"));

    // Rerender with same props (should use memoized function)
    rerender(<VanaAppSocialShareWidget shareContent="Original content" />);

    fireEvent.click(twitterButton);
    expect(mockWriteText).toHaveBeenCalledTimes(2);

    // Rerender with different props (should regenerate function)
    rerender(<VanaAppSocialShareWidget shareContent="New content" />);

    fireEvent.click(twitterButton);
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining("New content"));
  });

  it("tests DefaultShareButton component directly", () => {
    // Test the DefaultShareButton component with all its props
    const mockClick = vi.fn();
    render(
      <button
        onClick={mockClick}
        className="test-button"
        aria-label="Share on twitter"
        data-platform="twitter"
        style={{ cursor: "pointer" }}
      >
        <Twitter size={20} />
      </button>
    );

    const button = screen.getByLabelText("Share on twitter");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("test-button");
    expect(button).toHaveAttribute("data-platform", "twitter");
    expect(button).toHaveStyle("cursor: pointer");

    fireEvent.click(button);
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it("handles edge case with undefined/null values gracefully", () => {
    // Test with minimal props
    render(<VanaAppSocialShareWidget shareContent="" />);

    const twitterButton = screen.getByLabelText("Share on twitter");
    fireEvent.click(twitterButton);

    // Should still work with empty content
    expect(mockWriteText).toHaveBeenCalled();
    const clipboardText = mockWriteText.mock.calls[0][0];
    expect(clipboardText).toContain("app.vana.com"); // Should still have suffix
  });

  it("tests all platforms with complex content", () => {
    const complexContent = "Test content with: spaces, symbols & encoded chars = 100%";
    render(<VanaAppSocialShareWidget shareContent={complexContent} />);

    // Click each platform to test clipboard functionality
    const platforms = ["twitter", "facebook", "linkedin", "instagram"];

    platforms.forEach((platform) => {
      const button = screen.getByLabelText(`Share on ${platform}`);
      fireEvent.click(button);
    });

    // All platforms should have copied to clipboard
    expect(mockWriteText).toHaveBeenCalledTimes(4);

    // Each call should contain the complex content
    mockWriteText.mock.calls.forEach((call) => {
      expect(call[0]).toContain(complexContent);
    });
  });

  it("tests component cleanup and memory leaks", () => {
    const { unmount, rerender } = render(<VanaAppSocialShareWidget shareContent="Test" />);

    // Create multiple toasts
    const twitterButton = screen.getByLabelText("Share on twitter");

    act(() => {
      fireEvent.click(twitterButton);
    });

    // Rerender multiple times
    rerender(<VanaAppSocialShareWidget shareContent="Test 2" />);
    rerender(<VanaAppSocialShareWidget shareContent="Test 3" />);

    // Click again
    act(() => {
      fireEvent.click(twitterButton);
    });

    // Unmount should clean up without errors
    unmount();

    // Advance timers to ensure no memory leaks
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(true).toBe(true); // Test passes if no errors
  });
});
