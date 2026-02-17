import { TestHighlightedTextarea } from "../tests/components/TestHighlightedTextarea";
import { TestHighlightedInput } from "../tests/components/TestHighlightedInput";
import { HighlightedTextWrapper } from "../tests/components/TestHighlightedText";
import type { HighlightedRange } from "../src/rangeTree";

function TextareaDemo() {
  const highlightRanges: HighlightedRange<{ color: string }>[] = [
    { r: [0, 4], data: { color: "red" } },
    { r: [6, 11], data: { color: "blue" } },
    { r: [22, 33], data: { color: "green" } },
  ];
  const text = `This is a highlighted textarea example.
It supports multiple lines and highlights.
Something
else.`;

  return (
    <section>
      <h2>Textarea highlight</h2>
      <div style={{ width: 400 }}>
        <TestHighlightedTextarea
          value={text}
          highlightRanges={highlightRanges}
          rows={4}
          style={{
            width: "100%",
            fontSize: 16,
            fontFamily: "monospace",
          }}
        />
      </div>
    </section>
  );
}

function InputDemo() {
  const highlightRanges: HighlightedRange<{ color: string }>[] = [
    { r: [0, 11], data: { color: "purple" } },
    { r: [12, 17], data: { color: "orange" } },
  ];

  return (
    <section>
      <h2>Input highlight</h2>
      <div style={{ width: 400 }}>
        <TestHighlightedInput
          value="Highlighted input example. Very long one to test scrolling."
          highlightRanges={highlightRanges}
          style={{
            width: "100%",
            fontSize: 16,
            fontFamily: "monospace",
          }}
        />
      </div>
    </section>
  );
}

function TextDemo() {
  const highlightRanges: HighlightedRange<{ color: string }>[] = [
    { r: [0, 5], data: { color: "red" } },
    { r: [6, 16], data: { color: "blue" } },
    { r: [17, 21], data: { color: "green" } },
  ];

  return (
    <section>
      <h2>Text highlight</h2>
      <HighlightedTextWrapper
        text="Hello highlighted text!"
        ranges={highlightRanges}
      />
    </section>
  );
}

export function App() {
  return (
    <div style={{ padding: 32, fontFamily: "sans-serif" }}>
      <h1>react-highlighter playground</h1>
      <TextDemo />
      <hr style={{ margin: "24px 0" }} />
      <InputDemo />
      <hr style={{ margin: "24px 0" }} />
      <TextareaDemo />
    </div>
  );
}
