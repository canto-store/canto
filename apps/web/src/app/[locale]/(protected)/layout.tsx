import { checkAuth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";
import { headers } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAuth();
  const headersList = await headers();

  const pathname = headersList.get("x-pathname") || "/";

  const locale = headersList.get("NEXT_LOCALE") || "en";

  if (!isAuthenticated) {
    redirect({
      href: `/login?returnUrl=${encodeURIComponent(pathname)}`,
      locale: locale,
    });
  }

  return <>{children}</>;
}
