import { createRoot } from "react-dom/client";
import "../index.css";
import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryProvider } from "./providers/query-provider";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;
const root = createRoot(rootElement);

root.render(
  <QueryProvider>
    <RouterProvider router={router} />
    <TanStackRouterDevtools router={router} />
  </QueryProvider>
);
