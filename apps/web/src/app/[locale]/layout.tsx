import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { getMessages } from "next-intl/server";
import { Providers } from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/components/layout/AppLayout";
import { LocaleWrapper } from "@/components/locale-wrapper";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages();

  return (
    <LocaleWrapper locale={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        <Toaster />
      </NextIntlClientProvider>
    </LocaleWrapper>
  );
}
