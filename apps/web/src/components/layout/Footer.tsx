import { useRouter } from "@/i18n/navigation";
import Image from "next/image";

const navigation = {
  about: [
    { label: "About Us", href: "/about-us" },
    { label: "Canto Products", href: "/browse" },
    // { label: "Our Social Responsibility", href: "#" },
    // { label: "Our Partners", href: "#" },
  ],
  shop: [
    { label: "Your Orders", href: "/orders" },
    { label: "Your Account", href: "/settings" },
    { label: "Your Return items", href: "/returns" },
    { label: "Your Refund items", href: "/returns" },
    { label: "Track you Latest Order", href: "/orders" },
  ],
  business: [
    { label: "Sell your products on Canto", href: "/sell" },
    // {
    //   label:
    //     'Let us help you take your business to the next level (Join our "product managment" program)',
    //   href: "#",
    // },
    // { label: "Know about our terms and conditions", href: "#" },
  ],
  help: [
    { label: "Contact us", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

export function Footer() {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <footer className="bg-[var(--color-light-blue)] text-[var(--color-secondary)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-5">
          <div className="md:col-span-4">
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              <div>
                <h3 className="font-bold">About Canto</h3>
                <ul className="space-y-1">
                  {navigation.about.map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNavigate(item.href)}
                        className="hover:underline"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Shop with Canto</h3>
                <ul className="space-y-1">
                  {navigation.shop.map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNavigate(item.href)}
                        className="hover:underline"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Sell with Canto</h3>
                <ul className="space-y-1">
                  {navigation.business.map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNavigate(item.href)}
                        className="hover:underline"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold">Help</h3>
                <ul className="space-y-1">
                  {navigation.help.map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => handleNavigate(item.href)}
                        className="hover:underline"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-start justify-center md:col-span-1">
            <Image
              src="/logo-yellow-burgandy.png"
              alt="Canto"
              width={1000}
              height={1000}
              className="h-auto w-auto"
            />
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--color-secondary)] pt-8">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm">
              Copyright © 2025 Canto Store. All Rights Reserved.{" "}
              <button
                onClick={() => handleNavigate("/terms")}
                className="hover:underline"
              >
                Terms of Use
              </button>{" "}
              |{" "}
              <button
                onClick={() => handleNavigate("/privacy")}
                className="hover:underline"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
