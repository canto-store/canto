import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/forgot-password/ResetPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Reset Password",
    description: "Reset your password",
  };
}

export default async function Page() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto max-w-md px-4">
        <div className="mb-5 text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p>Reset your password</p>
        </div>
        <div className="rounded-lg p-6 shadow-lg">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
