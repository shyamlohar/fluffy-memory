import { useLoaderData, useLocation, useNavigate } from "react-router";
import { queriesStore } from "~/data/store/queries-store";
import { QueryRunner } from "~/components/query-runner";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";

export function clientLoader({ params }: { params: { id: string } }) {
  const queryId = parseInt(params.id, 10);
  const query = queriesStore.getQueryById(queryId);
  return { query };
}

export default function QueryDetail() {
  const navigate = useNavigate();
  const { query } = useLoaderData<typeof clientLoader>();
  const location = useLocation();
  const tabKey = `${location.pathname}${location.search}`;

  if (!query) {
    return <div className="p-4 flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-2">
        <p>Query not found. Create a new query to get started.</p>
        <Button variant="default" onClick={() => navigate("/query/new")}>
          <PlusIcon/>
          Create new query</Button>
      </div>
    </div>;
  }

  return (
    <div className="min-h-14 border-b p-4">
      <QueryRunner initialValue={query.value} tabKey={tabKey}>
        <QueryRunner.Input rows={6} />
        <QueryRunner.Actions>
          <QueryRunner.RunButton />
        </QueryRunner.Actions>
        <QueryRunner.Error />
        <QueryRunner.Results />
      </QueryRunner>
    </div>
  );
}