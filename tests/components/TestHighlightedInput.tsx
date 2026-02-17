import { useState, type ComponentProps } from "react";
import { useInputHighlight } from "../../src/useHighlight";
import { HighlightedText } from "../../src/HighlightedText";
import type { HighlightedRange } from "../../src/rangeTree";
import { InputOverlay } from "../../src/InputOverlay";
import { StyledInput } from "./StyledInput";

const renderRange = (key: string, text: string, data?: { color: string }) => {
  return (
    <span key={key} style={{ color: data?.color || "inherit" }}>
      {text}
    </span>
  );
};

export const TestHighlightedInput = ({
  highlightRanges = [],
  ...rest
}: ComponentProps<"input"> & {
  highlightRanges?: HighlightedRange<{ color: string }>[];
}) => {
  const [value, setValue] = useState((rest.value as string) ?? "");
  const {
    containerRef,
    inputRef,
    overlayRef,
    overlayStyle,
    displaying,
    onScroll,
  } = useInputHighlight();

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
      }}
    >
      <StyledInput
        {...rest}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onScroll={onScroll}
        ref={inputRef}
        displaying={displaying}
      />
      {displaying && (
        <InputOverlay ref={overlayRef} style={overlayStyle}>
          <HighlightedText
            text={value}
            ranges={highlightRanges}
            renderRange={renderRange}
          />
        </InputOverlay>
      )}
    </div>
  );
};
