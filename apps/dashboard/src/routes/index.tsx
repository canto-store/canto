import { LoginForm } from "@/components/login-form";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { isAuthenticated, isLoading } = useAuthStore.getState();
    if (!isLoading && isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main class="flex min-h-screen  items-center justify-center">
      <LoginForm />
    </main>
  );
}
