import { QueryRunner } from "~/components/query-runner";
import { queriesStore } from "~/data/store/queries-store";

export default function NewQuery() {
  const handleSave = async (sql: string) => {
    const nextIndex = queriesStore.getQueries().length + 1;
    queriesStore.addQuery(`Query ${nextIndex}`, sql);
  };

  return (
    <div className="min-h-14 border-b p-4">
      <QueryRunner onSave={handleSave}>
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
