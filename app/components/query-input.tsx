import { Textarea } from "~/components/ui/textarea";
import { forwardRef } from "react";

interface QueryInputProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const QueryInput = forwardRef<HTMLTextAreaElement, QueryInputProps>(
  ({ defaultValue = "", placeholder = "Please write your query here", className = "min-h-10", rows = 2 }, ref) => {
    return (
      <Textarea
        ref={ref}
        placeholder={placeholder}
        className={className}
        rows={rows}
        name="Query"
        defaultValue={defaultValue}
      />
    );
  }
);

QueryInput.displayName = "QueryInput";
