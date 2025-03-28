import { getSession } from "@/lib/auth/session";
import { redirect } from "@/i18n/navigation";
import { headers } from "next/headers";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const headersList = await headers();

  const pathname = headersList.get("x-pathname") || "/";

  const locale = headersList.get("NEXT_LOCALE") || "en";

  if (!session) {
    redirect({
      href: `/login?returnUrl=${encodeURIComponent(pathname)}`,
      locale: locale,
    });
  }

  return <>{children}</>;
}
