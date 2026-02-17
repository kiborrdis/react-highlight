import { test, expect } from "@playwright/experimental-ct-react";
import { TestHighlightedInput } from "./components/TestHighlightedInput";
import type { HighlightedRange } from "../src/rangeTree";
import { StyledInput } from "./components/StyledInput";

const screenshotConfig = {
  threshold: 0.01,
};
const width = 150;

test.describe("useInputHighlight screenshots", () => {
  test.use({ viewport: { width: 300, height: 200 } });

  test("input with no highlights", async ({ mount }) => {
    const component = await mount(
      <TestHighlightedInput style={{ width }} value="Hello world" />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("input with single highlight", async ({ mount }) => {
    const ranges: HighlightedRange<{ color: string }>[] = [
      { r: [0, 5], data: { color: "red" } },
    ];

    const component = await mount(
      <TestHighlightedInput
        style={{ width }}
        value="Hello world"
        highlightRanges={ranges}
      />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("input with multiple highlights", async ({ mount }) => {
    const ranges: HighlightedRange<{ color: string }>[] = [
      { r: [0, 5], data: { color: "red" } },
      { r: [6, 11], data: { color: "blue" } },
    ];

    const component = await mount(
      <TestHighlightedInput
        style={{ width }}
        value="Hello world"
        highlightRanges={ranges}
      />,
    );

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("empty input", async ({ mount }) => {
    const component = await mount(<TestHighlightedInput value="" />);

    await expect(component).toHaveScreenshot(screenshotConfig);
  });

  test("input with no highlights looks the same as plain input", async ({
    mount,
  }, testInfo) => {
    const components = await mount(
      <div>
        <div id="modified">
          <TestHighlightedInput style={{ width }} value="Hello world" />
        </div>
        <div id="plain">
          <StyledInput style={{ width }} value="Hello world" />
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
        threshold: 0.001,
      },
    );
    // After run with --update-snapshots this one will end up as expecte
    await expect(componentPlain).toHaveScreenshot(`${testInfo.title}.png`, {
      threshold: 0.001,
    });
  });

  test("scrolled input with no highlights looks the same as plain input", async ({
    mount,
  }, testInfo) => {
    const text = "Hello world this is a long text that will cause scrolling";
    const components = await mount(
      <div>
        <div id="modified">
          <TestHighlightedInput style={{ width }} value={text} />
        </div>
        <div id="plain">
          <StyledInput style={{ width }} value={text} />
        </div>
      </div>,
    );
    const componentWithHighlight = await components
      .locator("#modified")
      .first();
    const inputWithHighlight = await componentWithHighlight
      .locator("input")
      .first();

    await inputWithHighlight.focus();
    // Press End to scroll to the end of the input
    await inputWithHighlight.press("End");

    // Hack to compare plain with modified
    await expect(componentWithHighlight).toHaveScreenshot(
      `${testInfo.title}.png`,
      {
        threshold: 0.001,
      },
    );

    const componentPlain = await components.locator("#plain").first();
    const inputPlain = await componentPlain.locator("input").first();

    await inputPlain.focus();
    // Press End to scroll to the end of the input
    await inputPlain.press("End");

    await expect(componentPlain).toHaveScreenshot(`${testInfo.title}.png`, {
      threshold: 0.01,
    });
  });
});
