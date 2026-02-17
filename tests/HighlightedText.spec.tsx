import { test, expect } from "@playwright/experimental-ct-react";
import { HighlightedTextWrapper } from "./components/TestHighlightedText";
import type { HighlightedRange } from "../src/rangeTree";

const screenshotConfig = {
  threshold: 0.01,
};

test.describe("HighlightedText screenshots", () => {
  test.use({ viewport: { width: 300, height: 200 } });

  test("plain text", async ({ mount }) => {
    const component = await mount(
      <HighlightedTextWrapper text="Hello world" ranges={[]} />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("single highlighted range", async ({ mount }) => {
    const ranges: HighlightedRange<{ color: string }>[] = [
      { r: [0, 5], data: { color: "red" } },
    ];

    const component = await mount(
      <HighlightedTextWrapper text="Hello world" ranges={ranges} />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("multiple non-overlapping ranges", async ({ mount }) => {
    const ranges: HighlightedRange<{ color: string }>[] = [
      { r: [0, 5], data: { color: "red" } },
      { r: [6, 11], data: { color: "blue" } },
    ];

    const component = await mount(
      <HighlightedTextWrapper text="Hello world" ranges={ranges} />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("overlapping ranges", async ({ mount }) => {
    const ranges: HighlightedRange<{ color: string }>[] = [
      { r: [0, 7], data: { color: "red" } },
      { r: [5, 11], data: { color: "blue" } },
    ];

    const component = await mount(
      <HighlightedTextWrapper text="Hello world" ranges={ranges} />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });
});
