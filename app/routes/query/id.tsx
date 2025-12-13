import { useLoaderData, useLocation, useNavigate, useFetcher } from "react-router";
import { queriesStore } from "~/data/store/queries-store";
import { QueryRunner } from "~/components/query-runner";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "lucide-react";

export function clientLoader({ params }: { params: { id: string } }) {
  const queryId = parseInt(params.id, 10);
  const query = queriesStore.getQueryById(queryId);
  return { query };
}

export async function clientAction({ params, request }: { params: { id: string }; request: Request }) {
  const id = Number(params.id);
  const formData = await request.formData();
  const value = String(formData.get("value") ?? "");
  const nameRaw = formData.get("name");
  const name =
    typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : undefined;
  const updated = queriesStore.updateQuery(id, { name, value });
  return updated ?? { error: "not-found" };
}

export default function QueryDetail() {
  const navigate = useNavigate();
  const { query } = useLoaderData<typeof clientLoader>();
  const location = useLocation();
  const tabKey = `${location.pathname}${location.search}`;
  const fetcher = useFetcher<typeof clientAction>();
  const isSaving = fetcher.state !== "idle";

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

  const handleSave = async (sql: string) => {
    const defaultName = query.name;
    const name = window.prompt("Name this query", defaultName) || defaultName;
    fetcher.submit({ name, value: sql }, { method: "post" });
  };

  return (
    <div className="min-h-14 border-b p-4">
      <QueryRunner initialValue={query.value} tabKey={tabKey} onSave={handleSave} savingState={isSaving}>
        <QueryRunner.Input rows={6} />
        <QueryRunner.Actions>
          <QueryRunner.RunButton />
          <QueryRunner.SaveButton />
        </QueryRunner.Actions>
        <QueryRunner.Error />
        <QueryRunner.Duration />
        <QueryRunner.Results />
      </QueryRunner>
    </div>
  );
}