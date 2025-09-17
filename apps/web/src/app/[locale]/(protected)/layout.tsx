import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";

interface ProtectedLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return false;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (payload) return true;
    console.log("##### — payload =>", payload);
    return false;
  } catch (error) {
    console.error("Token verification failed:", error);
    return false;
  }
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
