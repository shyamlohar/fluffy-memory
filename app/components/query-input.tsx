import { Textarea } from "~/components/ui/textarea";
import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";

type QueryInputProps = {
  className?: string;
  rows?: number;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows" | "className">;

export const QueryInput = forwardRef<HTMLTextAreaElement, QueryInputProps>(
  (
    {
      placeholder = "Please write your query here",
      className = "min-h-10",
      rows = 2,
      ...props
    },
    ref
  ) => {
    return (
      <Textarea
        ref={ref}
        placeholder={placeholder}
        className={className}
        rows={rows}
        name="Query"
        {...props}
      />
    );
  }
);

QueryInput.displayName = "QueryInput";
