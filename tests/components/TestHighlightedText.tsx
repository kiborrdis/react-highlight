import { HighlightedText } from "../../src/HighlightedText";
import type { HighlightedRange } from "../../src/rangeTree";

const renderRange = (key: string, text: string, data?: { color: string }) => {
  return (
    <span key={key} style={{ color: data?.color || "inherit" }}>
      {text}
    </span>
  );
};

export const HighlightedTextWrapper = ({
  text,
  ranges,
}: {
  text: string;
  ranges: HighlightedRange<{ color: string }>[];
}) => {
  return (
    <div>
      <HighlightedText text={text} ranges={ranges} renderRange={renderRange} />
    </div>
  );
};
