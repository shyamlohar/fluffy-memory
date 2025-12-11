import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { queriesStore } from "~/data/store/queries-store";


// oxlint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const data = queriesStore.getQueries()
  return data;
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Home() {
  return <Welcome />;
}
