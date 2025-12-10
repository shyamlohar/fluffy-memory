import {
  type RouteConfig,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layouts/dashboard-layout.tsx", [
    route("/", "routes/home.tsx"),
    route("/query/:id", "routes/query/id.tsx"),
  ]),
] satisfies RouteConfig;
