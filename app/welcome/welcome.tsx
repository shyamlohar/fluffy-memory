import { Button } from "~/components/ui/button";
import {PlusIcon} from "lucide-react"
import { Link } from "react-router";

export function Welcome() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="leading-7">
          You don't have any Selected Query select a query or create a new one
        </div>
        <Button asChild>
          <Link to="/query/new"><PlusIcon/> Create a New Query</Link>
        </Button>
      </div>
    </div>
  );
}
