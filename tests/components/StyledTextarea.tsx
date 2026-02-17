import { forwardRef, type ComponentProps } from "react";
import styles from "./styles.module.css";

interface StyledTextareaProps extends ComponentProps<"textarea"> {
  caretColor?: string;
  displaying?: boolean;
}

export const StyledTextarea = forwardRef<
  HTMLTextAreaElement,
  StyledTextareaProps
>(({ caretColor = "rgb(0, 0, 0)", displaying = false, ...rest }, ref) => {
  return (
    <textarea
      {...rest}
      ref={ref}
      className={styles.textarea}
      style={{
        ...rest.style,
        caretColor,
        ...(displaying ? { color: "transparent" } : {}),
      }}
    />
  );
});

StyledTextarea.displayName = "StyledTextarea";
