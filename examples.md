### Hightligted input example

For mantine

```tsx
import { Input, type InputProps } from "@mantine/core";
import { type ComponentProps } from "react";
import { useInputHightlight } from "../useInputHightlight";
import { HightlightedText } from "../HightlightedText";
import { HighlightedRange } from "../rangeTree";
import styles from "./HightlightedInput.module.css";

const renderRange = (key: string, text: string, data?: { color: string }) => {
  return (
    <span key={key} style={{ color: data?.color || "inherit" }}>
      {text}
    </span>
  );
};

export const HightlightedInput = ({
  hightlightRules = [],
  ...rest
}: ComponentProps<"input"> &
  InputProps & {
    hightlightRanges?: HighlightedRange<{ color: string }>[];
  }) => {
  const color = "var(--mantine-color-text)";
  const {
    hightlightedContainerStyle,
    setTextarea,
    setContainer,
    onScroll,
    preEl,
    hightlightDisplaying,
  } = useInputHightlight({ textColor: color });

  return (
    <div
      ref={setContainer}
      style={{
        position: "relative",
      }}
    >
      <Input
        {...rest}
        bd={"none"}
        style={{
          border: "none",
        }}
        styles={{
          input: {
            border: "none",
            caretColor: color,
          },
        }}
        onScroll={onScroll}
        ref={(el) => {
          if (el) {
            document.addEventListener("selectionchange", onScroll);
          }
          setTextarea(el);
          return () => {
            document.removeEventListener("selectionchange", onScroll);
          };
        }}
        classNames={
          hightlightDisplaying
            ? {
                input: styles.hiddenText,
              }
            : undefined
        }
      />
      {hightlightDisplaying && (
        <pre style={hightlightedContainerStyle}>
          <div
            ref={preEl}
            style={{ width: "100%", overflowX: "hidden", whiteSpace: "nowrap" }}
          >
            <HightlightedText
              text={rest.value as string}
              ranges={hightlightRules}
              renderRange={renderRange}
            />
          </div>
        </pre>
      )}
    </div>
  );
};
```

With css

```css
.hiddenText {
  color: transparent;
}
.hiddenText::selection {
  background-color: SelectedItemText;
  color: transparent;
}
```


### Hightligted textarea example

```tsx
import { Textarea, type TextareaProps } from "@mantine/core";
import { HightlightedText } from "../HightlightedText";
import { useTextareaHightlight } from "../useTextareaHightlight";
import { HighlightedRange } from "../rangeTree";

const renderRange = (key: string, text: string, data?: { color: string }) => {
  return (
    <span key={key} style={{ color: data?.color || "inherit" }}>
      {text}
    </span>
  );
}

export const HighlightedTextarea = ({
  highlightedRanges = [],
  ...rest
}: TextareaProps & {
  highlightedRanges?: HighlightedRange<{ color: string }>[];
}) => {
  const color = "var(--mantine-color-text)";
  const {
    hightlightedContainerStyle,
    setTextarea,
    setContainer,
    onScroll,
    preEl,
    hightlightDisplaying,
  } = useTextareaHightlight({ textColor: color });

  return (
    <div
      ref={setContainer}
      style={{
        position: "relative",
      }}
    >
      <Textarea
        {...rest}
        onScroll={onScroll}
        ref={setTextarea}
        styles={{ input: { caretColor: color } }}
        classNames={
          hightlightDisplaying
            ? {
                input: styles.hiddenText,
              }
            : undefined
        }
      />
      {hightlightDisplaying && (
        <pre ref={preEl} style={hightlightedContainerStyle}>
          <HightlightedText
            text={rest.value as string}
            ranges={highlightedRanges}
            renderRange={renderRange}
          />
        </pre>
      )}
    </div>
  );
};
```

with css

```css
.hiddenText {
  color: transparent;
}
.hiddenText::selection {
  background-color: SelectedItemText;
  color: transparent;
}
```
