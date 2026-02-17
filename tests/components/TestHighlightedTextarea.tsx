import { useState, type ComponentProps } from "react";
import { HighlightedText } from "../../src/HighlightedText";
import type { HighlightedRange } from "../../src/rangeTree";
import { useTextareaHighlight } from "../../src/useHighlight";
import { InputOverlay } from "../../src/InputOverlay";
import { StyledTextarea } from "./StyledTextarea";

const renderRange = (key: string, text: string, data?: { color: string }) => {
  return (
    <span key={key} style={{ color: data?.color || "inherit" }}>
      {text}
    </span>
  );
};

export const TestHighlightedTextarea = ({
  highlightRanges = [],
  ...rest
}: ComponentProps<"textarea"> & {
  highlightRanges?: HighlightedRange<{ color: string }>[];
}) => {
  const {
    displaying,
    inputRef,
    overlayRef,
    containerRef,
    overlayStyle,
    onScroll,
  } = useTextareaHighlight();
  const [value, setValue] = useState((rest.value as string) ?? "");

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
      }}
    >
      <StyledTextarea
        {...rest}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onScroll={onScroll}
        ref={inputRef}
        displaying={displaying}
      />
      {displaying && (
        <InputOverlay ref={overlayRef} style={overlayStyle} textarea>
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
