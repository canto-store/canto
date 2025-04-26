import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export interface Session {
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
  };
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const decoded = jwtDecode(accessToken) as { name: string; email: string };
    return {
      isAuthenticated: true,
      user: {
        name: decoded.name,
        email: decoded.email,
      },
    };
  } catch (error) {
    console.error("Failed to decode session token:", error);
    return null;
  }
}
