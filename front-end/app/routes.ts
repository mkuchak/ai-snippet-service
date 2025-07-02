import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("snippets", "routes/snippets/index.tsx"),
  route("snippets/:id", "routes/snippets/$id.tsx"),
export default [index("routes/home.tsx")] satisfies RouteConfig;
] satisfies RouteConfig;
