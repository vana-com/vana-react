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

#### Features

- Cross-origin secure message communication
- Wallet authentication support
- Data upload with schema validation
- Theme customization
- Dynamic height resizing
- TypeScript support

#### Usage

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

#### Props

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
