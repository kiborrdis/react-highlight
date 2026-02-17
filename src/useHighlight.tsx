import {
  useState,
  useRef,
  useMemo,
  type CSSProperties,
  useEffect,
  useCallback,
} from "react";

const STYLE_PROPERTIES = [
  // Typography
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "fontVariant",
  "fontStretch",
  "lineHeight",
  "letterSpacing",
  "wordSpacing",
  "textTransform",
  "textAlign",
  "textIndent",
  "direction",
  "tabSize",
  "color",
  // Box model
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "boxSizing",
  // Text layout
  "whiteSpace",
  "wordBreak",
  "overflowWrap",

  "textRendering",
  "WebkitFontSmoothing",
] as const;

const getSizeFromEl = (el: HTMLTextAreaElement | HTMLInputElement) => {
  const styles = window.getComputedStyle(el);
  return [styles.width, styles.height] as [number | string, number | string];
};

const useHighlight = () => {
  const [el, setEl] = useState<HTMLTextAreaElement | HTMLInputElement | null>(
    null,
  );
  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLElement | null>(null);

  const [[width, height], setSize] = useState<
    [number | string, number | string]
  >([0, 0]);

  const inputStyles = useMemo(() => {
    if (!el) return {};

    const computedStyles = window.getComputedStyle(el);
    const applicableStyles: CSSProperties = {};
    for (const key of STYLE_PROPERTIES) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const val = computedStyles[key as any];
      if (val) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (applicableStyles as any)[key] = val;
      }
    }

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
        setSize(getSizeFromEl(el));
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

  const overlayStyle: CSSProperties = {
    ...inputStyles,
    // color: textColor,
    position: "absolute",
    top: `${distFromTop}px`,
    left: "0px",
    pointerEvents: "none",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderStyle: "solid",
    width,
    height,
  } satisfies CSSProperties;

  return {
    overlayStyle,

    inputRef: useCallback(
      (el: HTMLTextAreaElement | HTMLInputElement | null) => {
        setEl(el);

        if (el) {
          setSize(getSizeFromEl(el));
        }
      },
      [],
    ),
    containerRef: setContainerEl,
    overlayRef,
    el,
  };
};

export const useTextareaHighlight = () => {
  const { el, overlayRef, overlayStyle, containerRef, inputRef } =
    useHighlight();

  return {
    onScroll: useCallback(() => {
      if (el && overlayRef.current) {
        overlayRef.current.scrollTop = el.scrollTop;
      }
    }, [el, overlayRef]),
    inputRef,
    overlayRef,
    containerRef,
    overlayStyle,
    displaying: Boolean(el),
  };
};

export const useInputHighlight = () => {
  const {
    el,
    overlayRef,
    overlayStyle,
    containerRef,
    inputRef: prevInputRef,
  } = useHighlight();

  const syncScroll = useCallback(() => {
    if (el && overlayRef.current) {
      overlayRef.current.scrollLeft = el.scrollLeft;
    }
  }, [el, overlayRef]);

  const inputRef = useCallback(
    (el: HTMLInputElement | null) => {
      prevInputRef(el);
      const handler = (e: Event) => {
        if (e.target === el) {
          syncScroll();
        }
      };
      if (el) {
        document.addEventListener("selectionchange", handler);
      }

      return () => {
        document.removeEventListener("selectionchange", handler);
      };
    },
    [prevInputRef, syncScroll],
  );

  return {
    onScroll: syncScroll,
    inputRef,
    overlayRef,
    containerRef,
    overlayStyle,
    displaying: Boolean(el),
  };
};
