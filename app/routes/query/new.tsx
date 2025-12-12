import type { Route } from "./+types/new";
import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import { QueryRunner } from "~/components/query-runner";
import { queriesStore } from "~/data/store/queries-store";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const value = String(formData.get("value") ?? "");
  const nameRaw = formData.get("name");
  const name =
    typeof nameRaw === "string" && nameRaw.trim().length > 0
      ? nameRaw.trim()
      : "New query";

  const created = queriesStore.addQuery(name, value);
  return created;
}

export default function NewQuery() {
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof clientAction>();
  const isSaving = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.data?.id) {
      navigate(`/query/${fetcher.data.id}`);
    }
  }, [fetcher.data, navigate]);

  const handleSave = async (sql: string) => {
    fetcher.submit({ name: "New query", value: sql }, { method: "post" });
  };

  return (
    <div className="min-h-14 border-b p-4">
      <QueryRunner onSave={handleSave} savingState={isSaving}>
        <QueryRunner.Input rows={6} />
        <QueryRunner.Actions>
          <QueryRunner.RunButton />
          <QueryRunner.SaveButton />
        </QueryRunner.Actions>
        <QueryRunner.Error />
        <QueryRunner.Results />
      </QueryRunner>
    </div>
  );
}
