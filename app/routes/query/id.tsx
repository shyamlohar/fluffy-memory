import { useLoaderData, useLocation } from "react-router";
import { queriesStore } from "~/data/store/queries-store";
import { QueryRunner } from "~/components/query-runner";

export function clientLoader({ params }: { params: { id: string } }) {
  const queryId = parseInt(params.id, 10);
  const query = queriesStore.getQueryById(queryId);
  return { query };
}

export default function QueryDetail() {
  const { query } = useLoaderData<typeof clientLoader>();
  const location = useLocation();
  const tabKey = `${location.pathname}${location.search}`;

  if (!query) {
    return <div className="p-4">Query not found</div>;
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