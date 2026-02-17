# @brightgoose/react-highlight

Highlight text ranges in readonly elements, `<input>` and `<textarea>` elements in React.

Works by overlaying a styled copy of contents on top of the native element — preserving all native behavior: selection, IME, undo/redo, accessibility, and scroll.

Theoretically can be used with any UI library that allows passing refs to its input/textarea components, but only tested with native elements and Mantine so far.

## Install

```bash
npm install @brightgoose/react-highlight
```

Requires React 19+.

## Usage

### Highlighted Input

```tsx
import { useState } from "react";
import {
  useInputHighlight,
  InputOverlay,
  HighlightedText,
  type HighlightedRange,
} from "@brightgoose/highlight";

const ranges: HighlightedRange<{ color: string }>[] = [
  { r: [0, 5], data: { color: "red" } },
  { r: [6, 11], data: { color: "blue" } },
];

const renderRange = (key: string, text: string, data?: { color: string }) => (
  <span key={key} style={{ color: data?.color ?? "inherit" }}>
    {text}
  </span>
);

export function HighlightedInput() {
  const [value, setValue] = useState("Hello world");
  const {
    containerRef,
    inputRef,
    overlayRef,
    overlayStyle,
    displaying,
    onScroll,
  } = useInputHighlight();

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onScroll={onScroll}
        style={{
          color: displaying ? "transparent" : undefined,
          caretColor: "black",
        }}
      />
      {displaying && (
        <InputOverlay ref={overlayRef} style={overlayStyle}>
          <HighlightedText
            text={value}
            ranges={ranges}
            renderRange={renderRange}
          />
        </InputOverlay>
      )}
    </div>
  );
}
```

### Highlighted Textarea

```tsx
import { useState } from "react";
import {
  useTextareaHighlight,
  InputOverlay,
  HighlightedText,
  type HighlightedRange,
} from "@brightgoose/highlight";

const ranges: HighlightedRange<{ color: string }>[] = [
  { r: [0, 5], data: { color: "red" } },
];

const renderRange = (key: string, text: string, data?: { color: string }) => (
  <span key={key} style={{ color: data?.color ?? "inherit" }}>
    {text}
  </span>
);

export function HighlightedTextarea() {
  const [value, setValue] = useState("Hello world");
  const {
    containerRef,
    inputRef,
    overlayRef,
    overlayStyle,
    displaying,
    onScroll,
  } = useTextareaHighlight();

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onScroll={onScroll}
        style={{
          color: displaying ? "transparent" : undefined,
          caretColor: "black",
        }}
      />
      {displaying && (
        <InputOverlay ref={overlayRef} style={overlayStyle} textarea>
          <HighlightedText
            text={value}
            ranges={ranges}
            renderRange={renderRange}
          />
        </InputOverlay>
      )}
    </div>
  );
}
```

## Ranges

A `HighlightedRange` is a character range `[start, end]` with optional attached data:

```ts
type HighlightedRange<D = unknown> = {
  r: [number, number]; // [startIndex, endIndex], exclusive end
  data?: D;
};
```

Overlapping and nested ranges are supported. When ranges overlap, they are split at the boundary. Your `renderRange` function receives the split segments.

When ranges overlap or nest, by default the inner (child) range's `data` wins at overlapping segments. You can control this with the `mergeRangesData` prop on `<HighlightedText>`:

## API

### `useInputHighlight()`

Hook for `<input>` elements. Returns `{ containerRef, inputRef, overlayRef, overlayStyle, displaying, onScroll }`.

### `useTextareaHighlight()`

Hook for `<textarea>` elements. Returns the same shape.

### `<InputOverlay ref style textarea?>`

The overlay container. Pass `textarea` prop for textarea mode. Forward the `overlayRef` from the hook.

### `<HighlightedText text ranges renderRange mergeRangesData?>`

Renders text split into ranges. Place inside `InputOverlay` or use to render readonly text.

- `text` — the full string
- `ranges` — array of `HighlightedRange`
- `renderRange(key, text, data?)` — called for each segment, highlighted or not
- `mergeRangesData?(parentData, childData)` — optional callback to merge data at overlapping segments; default behaviour is for the inner range's data to win

## License

MIT
