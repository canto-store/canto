import { RegisterSuccess } from "@/components/auth/register/RegisterSuccess";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Register Success - Canto`,
  };
}

export default async function Page() {
  return <RegisterSuccess />;
}
