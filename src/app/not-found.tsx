import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button onClick={() => router.push("/")} className="mt-4">
        Go to Homepage
      </Button>
    </div>
  );
}
