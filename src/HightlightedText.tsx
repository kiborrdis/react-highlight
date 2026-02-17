import { useMemo } from "react";
import {
  HighlightedRange,
  makeRangesTree,
  rangesTreeToRanges,
} from "./rangeTree";

type RenderRange<D extends any = unknown> = (
  key: string,
  text: string,
  data?: D,
) => React.ReactNode;

export const HightlightedText = <D extends any = unknown>({
  text,
  ranges,
  renderRange,
}: {
  text: string;
  ranges: HighlightedRange<D>[];
  renderRange: RenderRange<D>;
}) => {
  const normalizedRanges = useMemo(() => {
    if (ranges.length === 0) {
      return [];
    }

    const tree = makeRangesTree(text.length, ranges);
    return rangesTreeToRanges(tree);
  }, [text, ranges]);

  return (
    <>
      {ranges.length === 0
        ? renderRange("0", text)
        : generateReactNodesForTextWithRanges(text, normalizedRanges, renderRange)}
    </>
  );
};

const generateReactNodesForTextWithRanges = <D extends any = unknown>(
  text: string,
  ranges: HighlightedRange<D>[],
  renderRange: RenderRange<D>,
) => {
  const elements = [];
  let currentIndex = 0;

  for (let i = 0; i < ranges.length; i++) {
    const { r } = ranges[i];

    if (r[0] > currentIndex) {
      elements.push(
        renderRange(`${currentIndex}-${r[0]}`, text.slice(currentIndex, r[0])),
      );
    }

    elements.push(
      renderRange(
        `${r[0]}-${r[1]}`,
        text.slice(r[0], r[1]),
        ranges[i].data,
      ),
    );

    currentIndex = r[1];
  }

  if (currentIndex < text.length) {
    elements.push(
      renderRange(`${currentIndex}-${text.length}`, text.slice(currentIndex)),
    );
  }

  return elements;
};
