import { render, screen, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { VanaAppUploadWidget } from "./VanaAppUploadWidget";

describe("VanaAppUploadWidget", () => {
  const mockProps = {
    appId: "test-app-123",
    onResult: vi.fn(),
    onError: vi.fn(),
    onAuth: vi.fn(),
  };

  let messageListeners: Array<(event: MessageEvent) => void> = [];

  beforeEach(() => {
    messageListeners = [];
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = vi.fn(
      (event: string, handler: EventListenerOrEventListenerObject) => {
        if (event === "message" && typeof handler === "function") {
          messageListeners.push(handler as (event: MessageEvent) => void);
        }
        originalAddEventListener.call(window, event, handler);
      }
    );

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders iframe with correct default src", () => {
    render(<VanaAppUploadWidget {...mockProps} />);
    const iframe = screen.getByTitle("Vana Data Upload Widget") as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toBe("https://app.vana.com/embed/upload");
  });

  it("renders iframe with custom origin", () => {
    const customOrigin = "https://custom.vana.com";
    render(<VanaAppUploadWidget {...mockProps} iframeOrigin={customOrigin} />);
    const iframe = screen.getByTitle("Vana Data Upload Widget") as HTMLIFrameElement;
    expect(iframe.src).toBe(`${customOrigin}/embed/upload`);
  });

  it("applies custom className", () => {
    const customClass = "custom-widget-class";
    const { container } = render(<VanaAppUploadWidget {...mockProps} className={customClass} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(customClass);
  });

  it("applies custom styles", () => {
    const customStyle = { width: "500px", height: "600px" };
    const { container } = render(<VanaAppUploadWidget {...mockProps} style={customStyle} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe("500px");
    expect(wrapper.style.height).toBe("600px");
  });

  it("sends config message when iframe signals ready", async () => {
    const { container } = render(
      <VanaAppUploadWidget {...mockProps} schemaId={123} prompt="Test prompt" />
    );
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;

    const mockPostMessage = vi.fn();
    Object.defineProperty(iframe, "contentWindow", {
      value: { postMessage: mockPostMessage },
      writable: true,
    });

    const readyEvent = new MessageEvent("message", {
      data: { type: "ready" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(readyEvent));

    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "config",
          appId: "test-app-123",
          schemaId: 123,
          aiPrompt: "Test prompt",
          operation: undefined,
          operationParams: undefined,
          embeddingOrigin: window.location.origin,
        }),
        "https://app.vana.com"
      );
    });
  });

  it("relays messages to iframe", async () => {
    const { container } = render(<VanaAppUploadWidget {...mockProps} />);
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;

    const mockPostMessage = vi.fn();
    Object.defineProperty(iframe, "contentWindow", {
      value: { postMessage: mockPostMessage },
      writable: true,
    });

    const relayData = { someData: "test" };
    const relayEvent = new MessageEvent("message", {
      data: { type: "relay", data: relayData },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(relayEvent));

    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith(relayData, "https://app.vana.com");
    });
  });

  it("calls onAuth when auth message received", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const authEvent = new MessageEvent("message", {
      data: { type: "auth", walletAddress: "0x123456789" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(authEvent));

    expect(mockProps.onAuth).toHaveBeenCalledWith("0x123456789");
  });

  it("calls onResult when complete message received", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const completeEvent = new MessageEvent("message", {
      data: {
        type: "complete",
        result: {
          status: "succeeded",
          result: {
            status: "ok",
            summary: "success-data",
            artifacts: [
              {
                name: "result.txt",
                artifact_path: "/path/to/result.txt",
                size: 1024,
                content_type: "text/plain",
              },
            ],
          },
        },
      },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(completeEvent));

    expect(mockProps.onResult).toHaveBeenCalledWith({
      output: "success-data",
      artifacts: [
        {
          name: "result.txt",
          artifact_path: "/path/to/result.txt",
          size: 1024,
          content_type: "text/plain",
        },
      ],
    });
  });

  it("calls onError when error message received", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const errorEvent = new MessageEvent("message", {
      data: { type: "error", message: "Something went wrong" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(errorEvent));

    expect(mockProps.onError).toHaveBeenCalledWith("Something went wrong");
  });

  it("calls onError with fallback when error has no message", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const errorEvent = new MessageEvent("message", {
      data: { type: "error" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(errorEvent));

    expect(mockProps.onError).toHaveBeenCalledWith("An error occurred");
  });

  it("calls onClose when close message received", () => {
    const onClose = vi.fn();
    render(<VanaAppUploadWidget {...mockProps} onClose={onClose} />);

    const closeEvent = new MessageEvent("message", {
      data: { type: "close" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(closeEvent));

    expect(onClose).toHaveBeenCalled();
  });

  it("does not throw when close message received without onClose handler", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const closeEvent = new MessageEvent("message", {
      data: { type: "close" },
      origin: "https://app.vana.com",
    });

    expect(() => {
      messageListeners.forEach((listener) => listener(closeEvent));
    }).not.toThrow();
  });

  it("resizes iframe when resize message received", () => {
    const { container } = render(<VanaAppUploadWidget {...mockProps} />);
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;

    const resizeEvent = new MessageEvent("message", {
      data: { type: "resize", height: 750 },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(resizeEvent));

    expect(iframe.style.height).toBe("750px");
  });

  it("ignores messages from incorrect origin", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const maliciousEvent = new MessageEvent("message", {
      data: { type: "auth", walletAddress: "malicious" },
      origin: "https://malicious.com",
    });

    messageListeners.forEach((listener) => listener(maliciousEvent));

    expect(mockProps.onAuth).not.toHaveBeenCalled();
  });

  it("removes event listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<VanaAppUploadWidget {...mockProps} />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("message", expect.any(Function));
  });

  it("handles theme configuration", async () => {
    const theme = {
      "--primary": "#FF0000",
      "--background": "#FFFFFF",
      "--card": "#F0F0F0",
    };
    const { container } = render(<VanaAppUploadWidget {...mockProps} theme={theme} />);
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;

    const mockPostMessage = vi.fn();
    Object.defineProperty(iframe, "contentWindow", {
      value: { postMessage: mockPostMessage },
      writable: true,
    });

    const readyEvent = new MessageEvent("message", {
      data: { type: "ready" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(readyEvent));

    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          theme,
        }),
        "https://app.vana.com"
      );
    });
  });

  it("handles multiple message types in sequence", () => {
    const onClose = vi.fn();
    const { container } = render(<VanaAppUploadWidget {...mockProps} onClose={onClose} />);
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;

    // Simulate auth
    const authEvent = new MessageEvent("message", {
      data: { type: "auth", walletAddress: "0xABC" },
      origin: "https://app.vana.com",
    });
    messageListeners.forEach((listener) => listener(authEvent));
    expect(mockProps.onAuth).toHaveBeenCalledWith("0xABC");

    // Simulate resize
    const resizeEvent = new MessageEvent("message", {
      data: { type: "resize", height: 500 },
      origin: "https://app.vana.com",
    });
    messageListeners.forEach((listener) => listener(resizeEvent));
    expect(iframe.style.height).toBe("500px");

    // Simulate completion
    const completeEvent = new MessageEvent("message", {
      data: {
        type: "complete",
        result: {
          status: "succeeded",
          result: {
            status: "ok",
            summary: "analysis results",
            artifacts: [],
          },
        },
      },
      origin: "https://app.vana.com",
    });
    messageListeners.forEach((listener) => listener(completeEvent));
    expect(mockProps.onResult).toHaveBeenCalledWith({
      output: "analysis results",
      artifacts: [],
    });

    // Simulate close
    const closeEvent = new MessageEvent("message", {
      data: { type: "close" },
      origin: "https://app.vana.com",
    });
    messageListeners.forEach((listener) => listener(closeEvent));
    expect(onClose).toHaveBeenCalled();
  });

  it("iframe has correct sandbox attributes", () => {
    render(<VanaAppUploadWidget {...mockProps} />);
    const iframe = screen.getByTitle("Vana Data Upload Widget") as HTMLIFrameElement;
    expect(iframe.getAttribute("sandbox")).toBe(
      "allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
    );
  });

  it("handles error with 'error' field instead of 'message'", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const errorEvent = new MessageEvent("message", {
      data: { type: "error", error: "Error from field" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(errorEvent));

    expect(mockProps.onError).toHaveBeenCalledWith("Error from field");
  });

  it("does not resize when height is missing", () => {
    const { container } = render(<VanaAppUploadWidget {...mockProps} />);
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;
    const originalHeight = iframe.style.height;

    const resizeEvent = new MessageEvent("message", {
      data: { type: "resize" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(resizeEvent));

    expect(iframe.style.height).toBe(originalHeight);
  });

  it("does not relay when data is missing", async () => {
    const { container } = render(<VanaAppUploadWidget {...mockProps} />);
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;

    const mockPostMessage = vi.fn();
    Object.defineProperty(iframe, "contentWindow", {
      value: { postMessage: mockPostMessage },
      writable: true,
    });

    const relayEvent = new MessageEvent("message", {
      data: { type: "relay" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(relayEvent));

    // Should not call postMessage when data is missing
    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it("sends operation and operationParams in config message", async () => {
    const { container } = render(
      <VanaAppUploadWidget
        {...mockProps}
        operation="analyze_sentiment"
        operationParams={{ model: "gpt-4", temperature: 0.7 }}
      />
    );
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;

    const mockPostMessage = vi.fn();
    Object.defineProperty(iframe, "contentWindow", {
      value: { postMessage: mockPostMessage },
      writable: true,
    });

    const readyEvent = new MessageEvent("message", {
      data: { type: "ready" },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(readyEvent));

    await waitFor(() => {
      expect(mockPostMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "config",
          operation: "analyze_sentiment",
          operationParams: { model: "gpt-4", temperature: 0.7 },
        }),
        "https://app.vana.com"
      );
    });
  });

  it("calls onError when polling status is failed", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const completeEvent = new MessageEvent("message", {
      data: {
        type: "complete",
        result: {
          status: "failed",
          error: "Operation failed on server",
        },
      },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(completeEvent));

    expect(mockProps.onError).toHaveBeenCalledWith("Operation failed on server");
  });

  it("calls onError when operation result is missing", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const completeEvent = new MessageEvent("message", {
      data: {
        type: "complete",
        result: null,
      },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(completeEvent));

    expect(mockProps.onError).toHaveBeenCalledWith("Operation completed with no result.");
  });

  it("handles operation with stdout as output", () => {
    render(<VanaAppUploadWidget {...mockProps} />);

    const completeEvent = new MessageEvent("message", {
      data: {
        type: "complete",
        result: {
          status: "succeeded",
          result: {
            status: "ok",
            stdout: "Console output from operation",
            artifacts: [],
          },
        },
      },
      origin: "https://app.vana.com",
    });

    messageListeners.forEach((listener) => listener(completeEvent));

    expect(mockProps.onResult).toHaveBeenCalledWith({
      output: "Console output from operation",
      artifacts: [],
    });
  });
});
