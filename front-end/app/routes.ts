import {
  index,
  layout,
  prefix,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Snippets routes
  route("snippets", "routes/snippets/index.tsx"),
  route("snippets/:id", "routes/snippets/$id.tsx"),

  // Authentication routes (TODO: need to implement)
  ...prefix("auth", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
    route("logout", "routes/auth/logout.tsx"),
  ]),
] satisfies RouteConfig;
