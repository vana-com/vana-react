"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Twitter, Facebook, Linkedin, Camera, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Theme configuration for visual customization of the VanaAppSocialShareWidget.
 *
 * @category Widgets
 */
export interface VanaAppSocialShareTheme {
  /** Icon size in pixels for social platform icons. Default: 20 */
  iconSize?: number;
}

/**
 * CSS class name configuration for styling all parts of the VanaAppSocialShareWidget.
 *
 * @remarks
 * Provides granular control over component styling. All class names are optional.
 * Platform-specific button styles can be applied using CSS attribute selectors:
 * `[data-platform="twitter"]`, `[data-platform="facebook"]`, etc.
 *
 * @category Widgets
 */
export interface VanaAppSocialShareClassNames {
  /** CSS class for the root container element */
  root?: string;
  /** CSS class for the title section (includes icon and text) */
  title?: string;
  /** CSS class for the buttons container */
  buttons?: string;
  /** CSS class applied to all share buttons */
  button?: string;
  /** CSS class for the toast notification container (if using internal toast) */
  toast?: string;
  /** CSS class for the toast content wrapper */
  toastContent?: string;
  /** CSS class for the countdown progress bar */
  progress?: string;
}

/**
 * Configuration properties for the VanaAppSocialShareWidget component.
 *
 * @remarks
 * **Required Props:**
 * - `shareContent`: The main result/content users want to share
 *
 * **Customization Props:**
 * - `classNames`: CSS class names for styling every component part
 * - `theme`: Visual customization (currently supports icon sizing)
 * - `renderButton`, `buttonComponent`: Custom button implementations
 *
 * **Event Props:**
 * - `onShare`: Callback when user initiates sharing (useful for analytics)
 * - `onShowToast`: Custom toast implementation (uses internal if not provided)
 *
 * @category Widgets
 */
export interface VanaAppSocialShareWidgetProps {
  /** Title displayed above share buttons (e.g., "Share your result") */
  title?: string;
  /** Main content to share - user's result, score, or generated content */
  shareContent: string;
  /** Suffix appended to share content. Default: "\n\nTry @ app.vana.com\n#datarevolution". Set to empty string to disable. */
  suffix?: string;
  /** Theme configuration for visual customization */
  theme?: VanaAppSocialShareTheme;
  /** CSS class names for styling all component parts */
  classNames?: VanaAppSocialShareClassNames;
  /** Hide the title section completely */
  hideTitle?: boolean;
  /** Hide the internal toast notification (use when providing custom toast via onCopySuccess) */
  hideToast?: boolean;
  /** Duration in milliseconds for how long the toast should be visible. Default: 4000 (4 seconds) */
  toastDuration?: number;
  /** Callback fired when text is copied to clipboard */
  onCopySuccess?: (platform: SocialPlatform, shareText: string) => void;
  /** Callback fired when user initiates sharing on any platform */
  onShare?: (platform: SocialPlatform) => void;
  /** Render prop for complete button customization */
  renderButton?: (platform: SocialPlatform, Icon: LucideIcon) => React.ReactNode;
  /** Custom button component to replace default buttons */
  buttonComponent?: React.ComponentType<ShareButtonProps>;
}

/**
 * Supported social media platforms for sharing.
 *
 * @category Widgets
 */
export type SocialPlatform = "twitter" | "facebook" | "linkedin" | "instagram";

/**
 * Props interface for custom share button components.
 *
 * @remarks
 * Used when providing a custom `buttonComponent` to the VanaAppSocialShareWidget.
 * The component receives these props for each social platform button.
 *
 * @category Widgets
 */
export interface ShareButtonProps {
  /** The social platform this button represents */
  platform: SocialPlatform;
  /** Lucide React icon component for the platform */
  Icon: LucideIcon;
  /** Click handler that triggers the share action */
  onClick: () => void;
  /** CSS class name applied to the button */
  className?: string;
  /** Icon size in pixels from theme configuration */
  iconSize?: number;
  /** Optional child content for the button */
  children?: React.ReactNode;
}

interface ShareButtonConfig {
  platform: SocialPlatform;
  Icon: LucideIcon;
  getUrl: (text: string) => string;
}

const SHARE_BUTTONS: ShareButtonConfig[] = [
  {
    platform: "twitter",
    Icon: Twitter,
    getUrl: (text: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
  },
  {
    platform: "facebook",
    Icon: Facebook,
    getUrl: (text: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        window.location.origin
      )}&quote=${encodeURIComponent(text)}`,
  },
  {
    platform: "linkedin",
    Icon: Linkedin,
    getUrl: (text: string) =>
      `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`,
  },
  {
    platform: "instagram",
    Icon: Camera,
    getUrl: () => "https://www.instagram.com/",
  },
];

const DefaultShareButton: React.FC<ShareButtonProps> = React.memo(
  ({ Icon, onClick, className, iconSize = 20, platform }) => (
    <button
      onClick={onClick}
      className={className}
      aria-label={`Share on ${platform}`}
      data-platform={platform}
      style={{ cursor: "pointer" }}
    >
      <Icon size={iconSize} />
    </button>
  )
);

DefaultShareButton.displayName = "DefaultShareButton";

/**
 * Provides seamless social sharing for Vana Apps with copy-to-clipboard and simple instructions.
 *
 * @remarks
 * VanaAppSocialShareWidget enables one-click sharing to Twitter, Facebook, LinkedIn, and Instagram.
 * Uses the navigator.clipboard API for secure text copying and shows simple instructions to
 * paste the content on the target platform. Component is completely unstyled by default for
 * maximum design flexibility.
 *
 * **Key Features:**
 * - Automatic share text generation with custom content and suffix
 * - Copy-to-clipboard with simple instruction notifications
 * - Consistent text across all platforms (no platform-specific URL handling needed)
 * - Customizable via classNames prop for every component part
 * - TypeScript support with full type definitions
 *
 * @example
 * ```tsx
 * import { VanaAppSocialShareWidget } from '@opendatalabs/vana-react';
 *
 * function MyDataApp() {
 *   const handleShare = (platform: string) => {
 *     console.log(`User shared on ${platform}`);
 *   };
 *
 *   return (
 *     <VanaAppSocialShareWidget
 *       shareContent="🍦 ChocoVision Leader (Dark Chocolate)"
 *       title="Share your flavor"
 *       onShare={handleShare}
 *       classNames={{
 *         root: "text-center",
 *         button: "w-12 h-12 rounded-full bg-white shadow-lg hover:scale-105"
 *       }}
 *       theme={{ iconSize: 20 }}
 *     />
 *   );
 * }
 * ```
 *
 * @category Widgets
 * @see For conceptual overview, visit https://docs.vana.org/social-sharing
 */
export const VanaAppSocialShareWidget: React.FC<VanaAppSocialShareWidgetProps> = React.memo(
  ({
    title = "Share",
    shareContent,
    suffix = "\n\nTry @ app.vana.com\n#datarevolution",
    theme = {},
    classNames = {},
    hideTitle = false,
    hideToast = false,
    toastDuration = 4000,
    onCopySuccess,
    onShare,
    renderButton,
    buttonComponent: ButtonComponent = DefaultShareButton,
  }) => {
    const [internalToast, setInternalToast] = useState<{
      message: {
        title: string;
        description: React.ReactNode;
        duration?: number;
      } | null;
    }>({ message: null });

    const toastTimerRef = useRef<NodeJS.Timeout>();

    const generateShareText = useCallback((): string => {
      return `${shareContent}${suffix}`;
    }, [shareContent, suffix]);

    const copyAndShowInstructions = (text: string, platform: string) => {
      // Copy to clipboard
      navigator.clipboard.writeText(text);

      // Trigger share callback (lowercase platform name)
      onShare?.(platform.toLowerCase() as SocialPlatform);

      // Call external copy success handler
      onCopySuccess?.(platform.toLowerCase() as SocialPlatform, text);

      // Show simple toast with instructions (if not hidden)
      if (!hideToast) {
        setInternalToast({
          message: {
            title: "Copied to clipboard!",
            description: `Now go to ${platform} and paste your message to share.`,
            duration: toastDuration,
          },
        });

        // Auto-hide toast after duration
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = setTimeout(() => {
          setInternalToast({ message: null });
        }, toastDuration);
      }
    };

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (toastTimerRef.current) {
          clearTimeout(toastTimerRef.current);
        }
      };
    }, []);

    const { iconSize = 20 } = theme;

    return (
      <div className={classNames.root} data-component="vana-app-social-share">
        {/* Title */}
        {!hideTitle && title && (
          <div className={classNames.title}>
            <Share2 size={16} />
            <span>{title}</span>
          </div>
        )}

        {/* Share Buttons */}
        <div className={classNames.buttons}>
          {SHARE_BUTTONS.map((config) => {
            const Icon = config.Icon;
            const text = generateShareText();

            const buttonClassName = classNames.button || "";

            const handleClick = () =>
              copyAndShowInstructions(
                text,
                config.platform.charAt(0).toUpperCase() + config.platform.slice(1)
              );

            if (renderButton) {
              return (
                <div key={config.platform} onClick={handleClick}>
                  {renderButton(config.platform, Icon)}
                </div>
              );
            }

            return (
              <ButtonComponent
                key={config.platform}
                platform={config.platform}
                Icon={Icon}
                onClick={handleClick}
                className={buttonClassName}
                iconSize={iconSize}
              />
            );
          })}
        </div>

        {/* Internal Toast - rendered via portal */}
        {!hideToast &&
          internalToast.message &&
          typeof document !== "undefined" &&
          createPortal(
            <>
              {!classNames.toast && (
                <style>
                  {`
                    [data-toast="true"] {
                      position: fixed;
                      bottom: calc(16px + env(safe-area-inset-bottom, 0px));
                      left: 16px;
                      right: 16px;
                      background-color: white;
                      border: 1px solid #ccc;
                      border-radius: 8px;
                      padding: 16px;
                      z-index: 9999;
                      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                      font-family: system-ui, sans-serif;
                      font-size: 14px;
                      line-height: 1.5;
                      max-width: 400px;
                      margin: 0 auto;
                    }
                    @media (min-width: 640px) {
                      [data-toast="true"] {
                        left: auto;
                        right: 16px;
                        max-width: 350px;
                        margin: 0;
                      }
                    }
                  `}
                </style>
              )}
              <div className={classNames.toast} data-toast="true">
                <div className={classNames.toastContent}>
                  <div style={{ fontWeight: "500", marginBottom: "4px" }}>
                    {internalToast.message.title}
                  </div>
                  <div style={{ opacity: 0.8 }}>{internalToast.message.description}</div>
                </div>
              </div>
            </>,
            document.body
          )}
      </div>
    );
  }
);

VanaAppSocialShareWidget.displayName = "VanaAppSocialShareWidget";
