import { createRoot } from "react-dom/client";
import "../index.css";
import { routeTree } from "./routeTree.gen";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const queryClient = new QueryClient();
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;
const root = createRoot(rootElement);

root.render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <TanStackRouterDevtools router={router} />
  </QueryClientProvider>
);
