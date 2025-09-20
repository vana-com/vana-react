"use client";

import { useEffect, useRef, useCallback } from "react";
import type { CSSProperties } from "react";

/**
 * Theme configuration for customizing the widget's appearance.
 * Uses CSS custom properties for styling.
 * @public
 */
export interface VanaAppUploadTheme {
  /** Background color for the main widget container */
  "--background"?: string;
  /** Background color for card elements */
  "--card"?: string;
  /** Background color for card elements when in dark mode */
  "--card-dark"?: string;
  /** Text color for card elements when in dark mode */
  "--card-foreground-dark"?: string;
  /** Background color for input fields */
  "--input-background"?: string;
  /** Background color for para overlay */
  "--para-overlay-background"?: string;
  /** Primary brand color */
  "--primary"?: string;
  /** Primary foreground (text) color */
  "--primary-foreground"?: string;
  /** Secondary color */
  "--secondary"?: string;
  /** Accent color */
  "--accent"?: string;
  /** Border color */
  "--border"?: string;
  /** Text color */
  "--foreground"?: string;
  /** Muted text color */
  "--muted-foreground"?: string;
  /** Allow any additional CSS custom properties */
  [key: `--${string}`]: string | undefined;
}

/**
 * Configuration properties for the VanaAppUploadWidget component.
 * @public
 */
export interface VanaAppUploadWidgetProps {
  /**
   * Application ID from the Vana Developer Portal (app.vana.com/build).
   * This identifies your app and its associated configuration.
   */
  appId: string;

  /**
   * Callback function invoked when data upload completes successfully.
   * @param data - The result data returned from the upload process
   */
  onResult: (data: string) => void;

  /**
   * Callback function invoked when an error occurs during the upload process.
   * @param error - Error message describing what went wrong
   */
  onError: (error: string) => void;

  /**
   * Callback function invoked when user successfully authenticates with their wallet.
   * @param walletAddress - The authenticated user's wallet address
   */
  onAuth: (walletAddress: string) => void;

  /**
   * Optional callback function invoked when user closes the widget.
   * Useful for hiding or removing the iframe container.
   */
  onClose?: () => void;

  /**
   * Origin URL of the Vana iframe application.
   * @defaultValue `"https://app.vana.com"`
   */
  iframeOrigin?: string;

  /**
   * Optional schema ID to override the app's default schema.
   * Each app has a configured schema, but you can specify a different one here.
   */
  schemaId?: number;

  /**
   * LLM inference prompt for the user's trusted server.
   * This prompt will be used to process the uploaded data.
   * @example
   * "Extract personality insights in JSON format { \"openness\": 0.33 } from user data: {{data}}"
   */
  prompt?: string;

  /**
   * Custom theme configuration using CSS custom properties.
   * @example
   * ```tsx
   * theme={{
   *   "--primary": "#007bff",
   *   "--background": "transparent",
   *   "--card": "rgba(255, 255, 255, 0.95)",
   *   "--foreground": "#1a1a1a"
   * }}
   * ```
   */
  theme?: VanaAppUploadTheme;

  /**
   * CSS class name(s) to apply to the widget container.
   * @defaultValue `"w-full relative min-h-[550px]"`
   */
  className?: string;

  /**
   * Inline styles to apply to the widget container.
   * Useful for dynamic styling or overriding defaults.
   */
  style?: CSSProperties;
}

/**
 * VanaAppUploadWidget - Embeddable React component for Vana App data upload operations.
 *
 * This component renders an iframe that facilitates secure data upload and processing
 * through the Vana Network. It handles cross-origin communication, wallet authentication,
 * and dynamic resizing.
 *
 * @example
 * Basic usage:
 * ```tsx
 * import { VanaAppUploadWidget } from '@opendatalabs/vana-react';
 *
 * function App() {
 *   return (
 *     <VanaAppUploadWidget
 *       appId="my-app-123"
 *       onResult={(data) => console.log('Upload successful:', data)}
 *       onError={(error) => console.error('Upload failed:', error)}
 *       onAuth={(wallet) => console.log('Authenticated:', wallet)}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * With custom theme and schema:
 * ```tsx
 * <VanaAppUploadWidget
 *   appId="my-app-123"
 *   schemaId={456}
 *   prompt="Upload your social media data"
 *   theme={{
 *     primaryColor: "#6366f1",
 *     backgroundColor: "#f9fafb"
 *   }}
 *   onResult={handleSuccess}
 *   onError={handleError}
 *   onAuth={handleAuth}
 * />
 * ```
 *
 * @param props - Configuration options for the widget
 * @returns A React component that renders the Vana data upload widget
 *
 * @public
 */
export function VanaAppUploadWidget({
  appId,
  onResult,
  onError,
  onAuth,
  onClose,
  iframeOrigin = "https://app.vana.com",
  schemaId,
  prompt,
  theme,
  className = "w-full relative min-h-[550px]",
  style,
}: VanaAppUploadWidgetProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeSrc = `${iframeOrigin}/embed/upload`;

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== iframeOrigin) {
        return;
      }

      const { type, ...data } = event.data;

      switch (type) {
        case "ready": {
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: "config",
                appId,
                schemaId,
                aiPrompt: prompt,
                embeddingOrigin: window.location.origin,
                theme,
              },
              iframeOrigin
            );
          }
          break;
        }

        case "relay": {
          if (iframeRef.current?.contentWindow && data.data) {
            iframeRef.current.contentWindow.postMessage(data.data, iframeOrigin);
          }
          break;
        }

        case "auth": {
          if (data.walletAddress) {
            onAuth(data.walletAddress);
          }
          break;
        }

        case "complete": {
          if (data.result) {
            onResult(data.result);
          }
          break;
        }

        case "error": {
          const errorMessage = data.message || data.error || "An error occurred";
          onError(errorMessage);
          break;
        }

        case "resize": {
          if (data.height && iframeRef.current) {
            iframeRef.current.style.height = `${data.height}px`;
          }
          break;
        }

        case "close": {
          if (onClose) {
            onClose();
          }
          break;
        }

        default: {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[VanaAppUploadWidget] Unknown message type: ${type}`, data);
          }
        }
      }
    },
    [appId, schemaId, prompt, theme, iframeOrigin, onAuth, onResult, onError, onClose]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  return (
    <div className={className} style={style}>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className="w-full border-none bg-transparent"
        style={{ width: "100%", border: "none", background: "transparent" }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
        title="Vana Data Upload Widget"
      />
    </div>
  );
}
