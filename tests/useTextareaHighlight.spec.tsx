import { test, expect } from "@playwright/experimental-ct-react";
import { TestHighlightedTextarea } from "./components/TestHighlightedTextarea";
import type { HighlightedRange } from "../src/rangeTree";
import { StyledTextarea } from "./components/StyledTextarea";

const screenshotConfig = {
  threshold: 0.01,
};
const width = 150;

test.describe("useTextareaHighlight screenshots", () => {
  test.use({ viewport: { width: 300, height: 200 } });

  test("textarea with no highlights", async ({ mount }) => {
    const component = await mount(
      <TestHighlightedTextarea style={{ width }} value="Hello world" />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("textarea with single highlight", async ({ mount }) => {
    const ranges: HighlightedRange<{ color: string }>[] = [
      { r: [0, 5], data: { color: "red" } },
    ];

    const component = await mount(
      <TestHighlightedTextarea
        style={{ width }}
        value="Hello world"
        highlightRanges={ranges}
      />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("textarea with multiple highlights", async ({ mount }) => {
    const ranges: HighlightedRange<{ color: string }>[] = [
      { r: [0, 5], data: { color: "red" } },
      { r: [6, 11], data: { color: "blue" } },
    ];

    const component = await mount(
      <TestHighlightedTextarea
        style={{ width }}
        value="Hello world"
        highlightRanges={ranges}
      />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("textarea with multiline text", async ({ mount }) => {
    const ranges: HighlightedRange<{ color: string }>[] = [
      { r: [0, 6], data: { color: "red" } },
      { r: [7, 13], data: { color: "blue" } },
      { r: [14, 20], data: { color: "green" } },
    ];

    const component = await mount(
      <TestHighlightedTextarea
        style={{ width }}
        value={"Line 1\nLine 2\nLine 3"}
        highlightRanges={ranges}
      />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("empty textarea", async ({ mount }) => {
    const component = await mount(<TestHighlightedTextarea value="" />);

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("textarea with no highlights looks the same as plain textarea", async ({
    mount,
  }, testInfo) => {
    const components = await mount(
      <div>
        <div id="modified">
          <TestHighlightedTextarea style={{ width }} value="Hello world" />
        </div>
        <div id="plain">
          <StyledTextarea style={{ width }} value="Hello world" />
        </div>
      </div>,
    );
    const componentWithHighlight = await components
      .locator("#modified")
      .first();
    const componentPlain = await components.locator("#plain").first();

    // Hack to compare plain with modified
    await expect(componentWithHighlight).toHaveScreenshot(
      `${testInfo.title}.png`,
      {
        threshold: 0.01,
      },
    );
    // After run with --update-snapshots this one will end up as expecte
    await expect(componentPlain).toHaveScreenshot(`${testInfo.title}.png`, {
      threshold: 0.01,
    });
  });

  test("scrolled textarea with no highlights looks the same as plain textarea", async ({
    mount,
  }, testInfo) => {
    const text =
      "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10";
    const components = await mount(
      <div>
        <div id="modified">
          <TestHighlightedTextarea style={{ width }} value={text} />
        </div>
        <div id="plain">
          <StyledTextarea style={{ width }} value={text} />
        </div>
      </div>,
    );
    const componentWithHighlight = await components
      .locator("#modified")
      .first();
    const textareaWithHighlight = await componentWithHighlight
      .locator("textarea")
      .first();

    // Press Control+End to scroll to the end of the textarea
    await textareaWithHighlight.evaluate(
      (el) => (el.scrollTop = el.scrollHeight),
    );

    const componentPlain = await components.locator("#plain").first();
    const textareaPlain = await componentPlain.locator("textarea").first();
    await textareaPlain.evaluate((el) => (el.scrollTop = el.scrollHeight));

    // Hack to compare plain with modified
    await expect(componentWithHighlight).toHaveScreenshot(
      `${testInfo.title}.png`,
      {
        threshold: 0.01,
      },
    );

    await expect(componentPlain).toHaveScreenshot(`${testInfo.title}.png`, {
      threshold: 0.01,
    });
  });
});
