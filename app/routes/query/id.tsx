import { useLoaderData } from "react-router";
import { useRef } from "react";
import { PlayIcon } from "lucide-react";
import { queriesStore } from "~/data/store/queries-store";
import { QueryInput } from "~/components/query-input";
import { Button } from "~/components/ui/button";

export function clientLoader({ params }: { params: { id: string } }) {
  const queryId = parseInt(params.id, 10);
  const query = queriesStore.getQueryById(queryId);
  return { query };
}

export default function QueryDetail() {
  const { query } = useLoaderData<typeof clientLoader>();
  const queryInputRef = useRef<HTMLTextAreaElement>(null);

  if (!query) {
    return <div className="p-4">Query not found</div>;
  }

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
        <QueryInput ref={queryInputRef} defaultValue={query.value} />
        <Button onClick={handleRun}>
          <PlayIcon />
          Run
        </Button>
      </div>
    </div>
  );
}