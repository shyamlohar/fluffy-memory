import type { Route } from "./+types/new";
import { useEffect } from "react";
import { useFetcher, useNavigate, useSearchParams } from "react-router";
import { QueryRunner } from "~/components/query-runner";
import { queriesStore } from "~/data/store/queries-store";
import { draftsStore } from "~/data/store/drafts-store";

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
  const [searchParams] = useSearchParams();
  const tabKey = searchParams.get("tab") ?? "default";
  const initialDraft = draftsStore.get(tabKey);

  useEffect(() => {
    if (fetcher.data?.id) {
      draftsStore.clear(tabKey);
      navigate(`/query/${fetcher.data.id}`);
    }
  }, [fetcher.data, navigate]);

  const handleChange = (value: string) => {
    draftsStore.set(tabKey, value);
  };

  const handleSave = async (sql: string) => {
    fetcher.submit({ name: "New query", value: sql }, { method: "post" });
  };

  return (
    <div className="min-h-14 border-b p-4">
      <QueryRunner
        key={tabKey}
        initialValue={initialDraft}
        onChangeValue={handleChange}
        onSave={handleSave}
        savingState={isSaving}
      >
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
