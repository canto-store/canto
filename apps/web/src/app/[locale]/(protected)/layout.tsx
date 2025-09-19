import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

async function isAuthenticated(): Promise<boolean> {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables.");
  }
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token || !refreshToken) return false;

  return jwtVerify(token, secret)
    .then(() => true)
    .catch(() =>
      jwtVerify(refreshToken, secret)
        .then(() => true)
        .catch(() => false),
    );
}

export default async function ProtectedLayout({
  children,
  params,
}: ProtectedLayoutProps) {
  const authenticated = await isAuthenticated();
  const resolvedParams = await params;

  if (!authenticated) {
    redirect(`/${resolvedParams.locale}/login`);
  }

  return <>{children}</>;
}
