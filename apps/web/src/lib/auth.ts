import api from "./api";

export async function checkAuth(): Promise<boolean> {
  try {
    const response = await api.get("/auth/me");
    return response.status === 200;
  } catch {
    return false;
  }
}
