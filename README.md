# @opendatalabs/vana-react

React hooks and components for integrating with the Vana Network.

[![npm version](https://img.shields.io/npm/v/@opendatalabs/vana-react.svg)](https://www.npmjs.com/package/@opendatalabs/vana-react)
[![Documentation](https://img.shields.io/badge/docs-typedoc-blue.svg)](https://opendatalabs.github.io/vana-react/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @opendatalabs/vana-react
# or
yarn add @opendatalabs/vana-react
# or
pnpm add @opendatalabs/vana-react
```

## Components

### VanaAppUploadWidget

An embeddable iframe widget that facilitates data upload operations for Vana Apps.

#### VanaAppUploadWidget Features

- Cross-origin secure message communication
- Wallet authentication support
- Data upload with schema validation
- Theme customization
- Dynamic height resizing
- TypeScript support

#### VanaAppUploadWidget Usage

```tsx
import { VanaAppUploadWidget } from "@opendatalabs/vana-react";

function App() {
  const handleResult = (data: string) => {
    console.log("Upload successful:", data);
  };

  const handleError = (error: string) => {
    console.error("Upload error:", error);
  };

  const handleAuth = (walletAddress: string) => {
    console.log("Authenticated:", walletAddress);
  };

  return (
    <VanaAppUploadWidget
      appId="your-app-id"
      onResult={handleResult}
      onError={handleError}
      onAuth={handleAuth}
      schemaId={123}
      prompt="Upload your data"
      theme={{
        primaryColor: "#007bff",
        backgroundColor: "#ffffff",
      }}
    />
  );
}
```

#### VanaAppUploadWidget Props

| Prop           | Type                              | Required | Default                         | Description                                      |
| -------------- | --------------------------------- | -------- | ------------------------------- | ------------------------------------------------ |
| `appId`        | `string`                          | Yes      | -                               | Your Vana application ID                         |
| `onResult`     | `(data: string) => void`          | Yes      | -                               | Callback when data upload completes successfully |
| `onError`      | `(error: string) => void`         | Yes      | -                               | Callback when an error occurs                    |
| `onAuth`       | `(walletAddress: string) => void` | Yes      | -                               | Callback when wallet authentication succeeds     |
| `iframeOrigin` | `string`                          | No       | `https://app.vana.com`          | Origin URL for the iframe                        |
| `schemaId`     | `number`                          | No       | -                               | Schema ID for data validation                    |
| `prompt`       | `string`                          | No       | -                               | Custom prompt text for the widget                |
| `theme`        | `Record<string, string>`          | No       | -                               | Theme customization object                       |
| `className`    | `string`                          | No       | `w-full relative min-h-[550px]` | CSS class for the widget container               |
| `style`        | `React.CSSProperties`             | No       | -                               | Inline styles for the widget container           |

### VanaAppSocialShareWidget

A customizable social sharing component designed for Vana Data Apps. Provides seamless sharing to social platforms with copy-to-clipboard functionality and countdown notifications.

#### VanaAppSocialShareWidget Features

- One-click sharing to Twitter, Facebook, LinkedIn, and Instagram
- Copy-to-clipboard with automatic countdown timer
- Customizable themes (light/dark/custom)
- Flexible text generation with emojis and funny notes
- Toast notifications with progress indicator
- TypeScript support with full type definitions
- Zero external UI dependencies

#### VanaAppSocialShareWidget Usage

```tsx
import { VanaAppSocialShareWidget } from "@opendatalabs/vana-react";

function MyDataApp() {
  const handleShare = (platform: string) => {
    console.log(`User shared on ${platform}`);
  };

  return (
    <VanaAppSocialShareWidget
      appName="Ice Cream Flavor"
      shareContent="ChocoVision Leader (Dark Chocolate)"
      shareEmoji="🍦"
      funnyNote="Apparently I'm in the same league as Beyoncé!"
      title="Share your flavor"
      onShare={handleShare}
      classNames={{
        root: "text-center",
        button: "w-12 h-12 rounded-full bg-white shadow-md hover:scale-105",
      }}
      theme={{ iconSize: 20 }}
    />
  );
}
```

#### Styling Examples

```tsx
// Light theme (Ice Cream app style)
<VanaAppSocialShareWidget
  appName="Ice Cream Flavor"
  shareContent="Your result"
  classNames={{
    root: "text-center",
    title: "text-purple-600 font-medium",
    buttons: "flex gap-4 justify-center",
    button: "w-12 h-12 rounded-full bg-white shadow-lg hover:scale-105"
  }}
/>

// Dark theme (Oracle/Coinology style)
<VanaAppSocialShareWidget
  appName="What Token Are You"
  shareContent="Your result"
  classNames={{
    root: "text-center",
    title: "text-green-400 font-mono uppercase",
    buttons: "flex gap-4 justify-center",
    button: "w-12 h-12 rounded-full border-2 border-green-400 bg-transparent hover:bg-green-400"
  }}
/>
```

#### VanaAppSocialShareWidget Props

| Prop              | Type                                    | Required | Default                | Description                                      |
| ----------------- | --------------------------------------- | -------- | ---------------------- | ------------------------------------------------ |
| `appName`         | `string`                                | Yes      | -                      | Name of your Vana app (e.g., "Ice Cream Flavor") |
| `shareContent`    | `string`                                | Yes      | -                      | Main content to share (e.g., user's result)      |
| `shareEmoji`      | `string`                                | No       | -                      | Emoji to prepend to share content                |
| `funnyNote`       | `string`                                | No       | -                      | Engaging note to add after content               |
| `title`           | `string`                                | No       | `"Share"`              | Title displayed above share buttons              |
| `callToAction`    | `string`                                | No       | `"Try @ app.vana.com"` | CTA text in share message                        |
| `hashtag`         | `string`                                | No       | `"#DATAREVOLUTION"`    | Hashtag to append to message                     |
| `theme`           | `VanaAppSocialShareTheme`               | No       | `{}`                   | Theme configuration (iconSize)                   |
| `onShare`         | `(platform: SocialPlatform) => void`    | No       | -                      | Callback when user shares                        |
| `onShowToast`     | `(message: ToastMessage) => void`       | No       | -                      | Custom toast handler (uses internal if not set)  |
| `classNames`      | `VanaAppSocialShareClassNames`          | No       | `{}`                   | Class names for all component parts              |
| `hideTitle`       | `boolean`                               | No       | `false`                | Hide the title section                           |
| `renderButton`    | `(platform, Icon) => ReactNode`         | No       | -                      | Custom render function for buttons               |
| `buttonComponent` | `React.ComponentType<ShareButtonProps>` | No       | -                      | Custom button component                          |

#### ClassNames Options

| Property       | Type     | Description                                     |
| -------------- | -------- | ----------------------------------------------- |
| `root`         | `string` | Root container class                            |
| `title`        | `string` | Title section class (includes icon and text)    |
| `buttons`      | `string` | Buttons container class                         |
| `button`       | `string` | Base class for all buttons                      |
| `toast`        | `string` | Toast container class (if using internal toast) |
| `toastContent` | `string` | Toast content wrapper class                     |
| `progress`     | `string` | Progress bar class for countdown                |

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm

### Setup

```bash
# Install dependencies
npm install

# Run development build with watch mode
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Run linting
npm run lint

# Type checking
npm run typecheck
```

### Testing

```bash
# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm test
```

## Contributing

Please read our contributing guidelines before submitting PRs.

## License

MIT © OpenDataLabs
