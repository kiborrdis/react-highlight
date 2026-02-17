import { forwardRef, type ComponentProps } from "react";
import styles from "./styles.module.css";

interface StyledInputProps extends ComponentProps<"input"> {
  caretColor?: string;
  displaying?: boolean;
}

export const StyledInput = forwardRef<HTMLInputElement, StyledInputProps>(
  ({ caretColor = "rgb(0, 0, 0)", displaying = false, ...rest }, ref) => {
    return (
      <input
        {...rest}
        ref={ref}
        className={styles.input}
        style={{
          ...rest.style,
          caretColor,
          ...(displaying ? { color: "transparent" } : {}),
        }}
      />
    );
  },
);

StyledInput.displayName = "StyledInput";
