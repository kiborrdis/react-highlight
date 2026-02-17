import { CSSProperties, ForwardedRef, forwardRef, ReactNode } from "react";

type InputOverlayProps = {
  style: CSSProperties;
  children: ReactNode;
  textarea?: boolean;
};

const InnerInputStyle: CSSProperties = {
  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: "inherit",
  fontStyle: "inherit",
  fontVariant: "inherit",
  fontStretch: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  wordSpacing: "inherit",
  textTransform: "inherit",
  textAlign: "inherit",
  textIndent: "inherit",
  direction: "inherit",
  tabSize: "inherit",
  color: "inherit",
  wordBreak: "inherit",
  overflowWrap: "inherit",
  margin: 0,
  padding: 0,
  border: "none",
  whiteSpace: "pre",
  overflow: "hidden",
};

export const InputOverlay = forwardRef<HTMLElement, InputOverlayProps>(
  ({ textarea = false, style, children }, ref) => {
    if (!textarea) {
      return (
        // Input elements don't display text in the padding area, but <pre> elements do.
        // By wrapping a zero-padded <pre> inside a <div> with padding, we emulate the input's clipping behavior.
        <div style={style}>
          <pre
            ref={ref as ForwardedRef<HTMLPreElement>}
            style={InnerInputStyle}
            aria-hidden="true"
          >
            {children}
          </pre>
        </div>
      );
    }

    return (
      <pre
        ref={ref as ForwardedRef<HTMLPreElement>}
        style={{ ...style, overflow: "hidden" }}
        aria-hidden="true"
      >
        {children}
        <br />
      </pre>
    );
  },
);
InputOverlay.displayName = "InputOverlay";
