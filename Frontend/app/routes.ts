import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
  route("/", "./routes/RentRoute.tsx"),
  route("print", "./routes/PrintRoute.tsx"),
] satisfies RouteConfig;







