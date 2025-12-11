import { useRef } from "react";
import { PlayIcon } from "lucide-react";
import { QueryInput } from "~/components/query-input";
import { Button } from "~/components/ui/button";

export default function NewQuery() {
  const queryInputRef = useRef<HTMLTextAreaElement>(null);

  const handleRun = () => {
    const queryValue = queryInputRef.current?.value;
    if (queryValue) {
      console.log("Running query:", queryValue);
      // TODO: Implement query execution logic
    }
  };

  return (
    <div className="min-h-14 border-b p-4">
      <div className="flex items-start gap-4">
        <QueryInput ref={queryInputRef} />
        <Button onClick={handleRun}>
          <PlayIcon />
          Run
        </Button>
      </div>
    </div>
  );
}
