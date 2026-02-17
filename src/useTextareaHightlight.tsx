import { useState, useRef, useMemo, type CSSProperties, useEffect } from "react";

export const useTextareaHightlight = ({ textColor }: { textColor: string; }) => {
  const [el, setEl] = useState<HTMLTextAreaElement | null>(null);
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const [[width, height], setTextareaSize] = useState<
    [number | string, number | string]
  >([0, 0]);

  const preEl = useRef<HTMLPreElement | null>(null);

  const textareaStyles = useMemo(() => {
    if (!el) return {};

    const computedStyles = window.getComputedStyle(el);
    const applicableStyles: CSSProperties = {};
    let keys = new Set(Object.keys(computedStyles));

    // Safari does not iterate through string keys of CSSStyleDeclaration
    if (!keys.has("width")) {
      keys = new Set(
        Object.keys(Object.getPrototypeOf(window.getComputedStyle(el)))
      );
    }

    keys.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const val = (computedStyles as Record<string, any>)[key];
      if (val &&
        typeof val !== "function" &&
        key !== "length" &&
        !key.toLowerCase().includes("background") &&
        !key.toLowerCase().includes("outline") &&
        !key.toLowerCase().includes("webkit") &&
        !key.toLowerCase().includes("column") &&
        !key.toLowerCase().includes("color") &&
        !key.toLowerCase().includes("epub") &&
        !key.toLowerCase().includes("apple") &&
        !key.toLowerCase().includes("additive") &&
        !/^\d/.test(key)) {
        let formattedKey = key;

        if (key.includes("-")) {
          formattedKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        }

        applicableStyles[formattedKey as unknown as keyof CSSProperties] =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          val as any;
      }
    });
    setTextareaSize([computedStyles["width"], computedStyles["height"]]);

    return applicableStyles;
  }, [el]);

  const distFromTop = useMemo(() => {
    if (!el || !containerEl) return 0;
    const elRect = el.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    return elRect.top - containerRect.top;
  }, [el, containerEl]);

  useEffect(() => {
    const handleResize = () => {
      if (el) {
        setTextareaSize([el.clientWidth, el.clientHeight]);
      }
    };

    const observer = new ResizeObserver(handleResize);

    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [el]);

  const hightlightedContainerStyle: CSSProperties = {
    ...textareaStyles,
    color: textColor,
    position: "absolute",
    top: `${distFromTop}px`,
    left: "0px",
    pointerEvents: "none",
    backgroundColor: "transparent",
    borderColor: "transparent",
    width,
    height,
  } satisfies CSSProperties;

  return {
    hightlightedContainerStyle,

    setTextarea: setEl,
    setContainer: setContainerEl,

    hightlightDisplaying: Boolean(el),

    onScroll: () => {
      if (el && preEl.current) {
        preEl.current.scrollTop = el.scrollTop;
      }
    },
    preEl,
  };
};
