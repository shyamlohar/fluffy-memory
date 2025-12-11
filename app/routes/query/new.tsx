import { PlayIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

export default function NewQuery() {
  return (
    <div className="min-h-14 border-b p-4">
      <div className="flex items-start h-screen gap-4">
        <Textarea placeholder="Please write your query here" className="min-h-10" rows={2} name="Query" />
        <Button>
          <PlayIcon />
          Run
        </Button>
      </div>
    </div>
  );
}
