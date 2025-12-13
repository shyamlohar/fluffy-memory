import type { Route } from "./+types/new";
import { useEffect } from "react";
import { useFetcher, useNavigate, useSearchParams, useLocation } from "react-router";
import { QueryRunner } from "~/components/query-runner";
import { queriesStore } from "~/data/store/queries-store";
import { draftsStore } from "~/data/store/drafts-store";
import { useTabs } from "~/components/tabs-context";
import { resultsStore } from "~/data/store/results-store";

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
  const location = useLocation();
  const { replaceTab } = useTabs();
  const initialDraft = draftsStore.get(tabKey);
  const tabPath = `/query/new${location.search}`;

  useEffect(() => {
    if (fetcher.data?.id) {
      const title = fetcher.data.name ?? `Query ${fetcher.data.id}`;
      const nextPath = `/query/${fetcher.data.id}`;
      const existingResult = resultsStore.get(tabPath);
      replaceTab(tabPath, {
        type: "query",
        id: fetcher.data.id,
        title,
        path: nextPath,
      });
      draftsStore.clear(tabKey);
      resultsStore.clear(tabPath);
      if (existingResult) {
        resultsStore.set(nextPath, existingResult);
      }
      navigate(nextPath);
    }
  }, [fetcher.data, navigate, tabPath, replaceTab, tabKey]);

  const handleChange = (value: string) => {
    draftsStore.set(tabKey, value);
  };

  const handleSave = async (sql: string) => {
    const defaultName = `New Query ${queriesStore.getQueries().length + 1}`;
    const name = window.prompt("Name this query", defaultName) || defaultName;
    fetcher.submit({ name, value: sql }, { method: "post" });
  };

  return (
    <div className="min-h-14 border-b p-4">
      <QueryRunner
        key={tabKey}
        initialValue={initialDraft}
        onChangeValue={handleChange}
        onSave={handleSave}
        savingState={isSaving}
        tabKey={tabPath}
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
