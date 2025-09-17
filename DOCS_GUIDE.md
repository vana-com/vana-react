# **Vana React TSDoc Style Guide**

**Objective:** To ensure the Vana React library's auto-generated API reference is consistently clear, precise, and focused on enabling React developers. This is the canonical guide for all TSDoc comments within the @opendatalabs/vana-react codebase.

## 1. Guiding Philosophy: The Map, Not the Compass

We maintain two sets of documentation with distinct purposes:

- **`docs.vana.org` is the Compass.** It answers the "Why" and the "How," providing conceptual understanding and end-to-end tutorials.
- **The React Library API Reference is the Map.** It answers the "What," providing precise, unambiguous, and immediate information to a React developer who is actively writing components.

Every comment in the library must serve as a clear, accurate marker on this map. We prioritize density and accuracy over narrative.

## 2. Our Audience

When writing TSDoc, you are writing for a React developer in their editor. They are:

- **The Component Builder:** Needs the exact props, their types, and callback signatures. They will copy your example.
- **The Debugger:** Needs to know what events fire, edge cases, and expected component behavior.
- **The Explorer:** Scans component and hook summaries to understand the library's surface area.

## 3. The Standardized TSDoc Structure

Adhere to this structure for all public-facing members. Consistency is key.

### **For Components**

```typescript
/**
 * (A one-sentence summary starting with an active verb.)
 *
 * @remarks
 * (A more detailed paragraph on the component's role and key features.
 * Explain *what* it enables the developer to build. If a core Vana concept is mentioned,
 * provide a brief, self-contained explanation.)
 *
 * @category (A category for the TypeDoc sidebar, e.g., "Widgets", "Hooks")
 * @see For a conceptual overview, visit https://docs.vana.org.
 */
export function MyComponent(props: MyComponentProps) {
  /* ... */
}
```

### **Props Documentation for Components**

When a component has multiple props with different purposes, provide clear documentation:

```typescript
/**
 * Configuration properties for the VanaAppUploadWidget component.
 *
 * @remarks
 * **Required Props:**
 * - `appId`: Your application identifier from Vana dashboard
 * - `onResult`, `onError`, `onAuth`: Event callbacks for widget lifecycle
 *
 * **Customization Props:**
 * - `theme`: Visual customization via CSS variables
 * - `className`, `style`: Standard React styling props
 *
 * @category Components
 */
export interface VanaAppUploadWidgetProps {
```

**Guidelines:**

- Group **required vs optional** props clearly
- Note **callback signatures** and when they fire
- Document **default values** where applicable
- Use **practical examples** in prop descriptions

### **For Hooks**

The order of tags must be: summary, `@remarks`, `@param`, `@returns`, `@example`, `@see`.

```typescript
/**
 * (Summary: A concise, active-verb phrase describing what the hook provides.)
 *
 * @remarks
 * (Optional: Critical context about state management or side-effects.
 * e.g., "This hook manages WebSocket connections and automatically
 * reconnects on disconnection.")
 *
 * @param config - (Description of the configuration object.)
 * @param config.someOption - (Description of a specific option's purpose.)
 * @returns (Description of the hook's return value - typically an object with state and functions.)
 *
 * @example
 * (A self-contained, copy-pasteable React component using the hook.)
 *
 * @see (Optional: Link to a conceptual doc page for more context.)
 */
export function useMyHook(config: MyConfig): MyHookReturn {
  /* ... */
}
```

### **Enhanced Parameter Documentation**

When parameters require external acquisition or have non-obvious sources, provide factual guidance:

```typescript
/**
 * @param permissions.publicKey - The recipient's public key for encryption.
 *   Obtain via `vana.server.getIdentity(userAddress).public_key`.
 * @param permissions.grantee - The application's wallet address that will access the data.
 */
```

**Guidelines:**

- State **how to obtain** parameter values using specific SDK methods
- Clarify **which identifier** is needed when multiple exist
- Provide **factual descriptions** without assumptions about developer knowledge

### **For Types and Interfaces**

Every public property must be documented.

```typescript
/**
 * (A one-sentence summary of what this data structure represents.)
 */
export interface MyType {
  /** (A comment for *every* public property explaining its purpose.) */
  readonly someProperty: string;
}
```

## 4. Voice & Style

| Do                                                                         | Don't                                                                           |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Use active voice.** "Retrieves a list of..."                             | Use passive voice. "A list of files is retrieved..."                            |
| **Be specific and concrete.** "Returns an array of `UserFile` objects."    | Be vague. "Returns the files."                                                  |
| **Use `backticks` for all technical terms.** `VRC-20`, `fileId`, `true`.   | Forget to format technical terms.                                               |
| **Start summaries with a verb.** "Grants...", "Validates...", "Uploads..." | Start with "This function is for..." or "This allows you to..."                 |
| **Describe the _purpose_ of a parameter.** `@param url - The storage URL.` | Describe the _type_ of a parameter. `@param url - A string containing the URL.` |
| **Document every public property and method.**                             | Leave exported members undocumented.                                            |
| **Throw specific, typed errors.** `throw new RelayerError(...)`            | `throw new Error('Something went wrong')`                                       |

### Terminology

- **Vana:** The network, the protocol, the company.
- **$VANA:** The native token.
- **DataDAO:** The user-facing term for a data collective. Use this in most high-level descriptions.
- **Data Liquidity Pool (DLP):** The technical, smart-contract-level term. Use only when referring specifically to the contract type or its address.
- **Gasless Transaction:** The preferred user-facing term.
- **Meta-Transaction:** The underlying technical term. Use sparingly.

## 5. Examples are Non-Negotiable

A good example is the most critical part of the documentation.

1.  **Be Self-Contained:** An example must be runnable by copying it into a React component file. Include necessary imports.
2.  **Show the Happy Path:** The primary example must demonstrate the most common, successful use case.
3.  **Be Realistic:** Use descriptive variable names (`const handleResult = ...`) and realistic placeholder values (`appId: 'my-app-123'`).
4.  **Focus on the Component/Hook:** The example must showcase the component or hook being documented, not other React patterns.

**Correct Example:**

````typescript
/**
 * @example
 * ```tsx
 * import { VanaAppUploadWidget } from '@opendatalabs/vana-react';
 *
 * function MyApp() {
 *   const handleResult = (data: string) => {
 *     console.log('Upload successful:', data);
 *   };
 *
 *   return (
 *     <VanaAppUploadWidget
 *       appId="my-app-123"
 *       onResult={handleResult}
 *       onError={(err) => console.error(err)}
 *       onAuth={(wallet) => console.log('Connected:', wallet)}
 *     />
 *   );
 * }
 * ```
 */
````

## 6. Explaining Core Concepts

While the API reference should be concise, it's crucial to provide enough context for developers to understand core Vana concepts without leaving their editor.

- **Use `@remarks` for brief explanations:** When a method or class introduces a core concept (e.g., `Data Refinement`, `Proof of Contribution`), provide a one or two-sentence explanation within the `@remarks` block.
- **Prioritize clarity and self-containment:** The goal is to give the developer just enough information to use the API effectively. Avoid deep dives that are better suited for `docs.vana.org`.
- **Use `@see` for further reading:** If a concept warrants more detailed explanation, use the `@see` tag to point developers to the main documentation website as a resource for further learning.

### **Architecture Context for Complex Components**

When documenting components that involve multi-step processes or communication patterns:

```typescript
/**
 * @remarks
 * **Communication Architecture:**
 * VanaAppUploadWidget uses postMessage API for secure cross-origin communication with the iframe.
 * This enables data isolation while maintaining responsive user interactions.
 */
```

**Guidelines:**

- Provide **one-sentence architecture summary** when the design affects usage
- Explain **the rationale** behind architectural decisions briefly
- Focus on **what developers need to understand** to use the API correctly
- Maintain **neutral, factual tone** without justifying design choices

**Correct Usage:**

```typescript
/**
 * Initiates a data refinement process on a set of user files.
 *
 * @remarks
 * Data refinement is the process of transforming raw data into a structured and
 * privacy-preserving format using a predefined "refiner."
 *
 * @param refinerId - The ID of the refiner to use for processing.
 * @param fileIds - An array of file IDs to be refined.
 * @returns A promise that resolves with the ID of the refinement job.
 * @see For a detailed explanation of data refinement, see the [Data Refinement & Publishing](https://docs.vana.org/docs/data-refinement) guide.
 */
```

**Incorrect Usage:**

```typescript
/**
 * @remarks
 * Data refinement is a multi-stage process involving several smart contracts...
 * (This is too detailed for the API reference and will become stale.)
 */
```

## 7. Error Documentation with Recovery Information

Enhance `@throws` documentation to include factual recovery strategies when errors are user-actionable.

```typescript
/**
 * @throws {NetworkError} When IPFS gateway is unreachable.
 *   Check network connection or configure alternative gateways via `ipfsGateways`.
 * @throws {SchemaValidationError} When data format doesn't match the specified schema.
 *   Verify data structure matches schema definition from `vana.schemas.get(schemaId)`.
 * @throws {RelayerError} When gasless transaction submission fails.
 *   Retry without relayer configuration to submit direct transaction.
 */
```

**Guidelines:**

- Include **specific recovery actions** for user-actionable errors
- Reference **SDK methods or configuration options** that address the error
- Use **imperative voice** for recovery instructions ("Check...", "Configure...", "Verify...")
- Focus on **immediate next steps** rather than general troubleshooting advice

## 8. React-Specific Documentation Patterns

When documenting React-specific behaviors and patterns:

````typescript
/**
 * @param theme - CSS variables for visual customization
 * @remarks
 * Theme changes trigger re-renders. For performance-sensitive applications,
 * memoize the theme object using `useMemo` to prevent unnecessary re-renders.
 *
 * @example
 * ```tsx
 * const theme = useMemo(() => ({
 *   primaryColor: userPreferences.color,
 *   backgroundColor: '#ffffff'
 * }), [userPreferences.color]);
 * ```
 */
````

**Guidelines:**

- **Document performance implications** of prop changes
- **Provide optimization patterns** when relevant (memoization, lazy loading)
- **Note React lifecycle interactions** (mounting, unmounting, re-renders)
- **Include accessibility considerations** for components
