"use client";

import { useTranslations } from "next-intl";
import { useForgotPassword } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const forgotPasswordFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

type FormData = z.infer<typeof forgotPasswordFormSchema>;

export function ForgotPasswordForm({
  setIsSuccess,
}: {
  setIsSuccess: (success: boolean) => void;
}) {
  const t = useTranslations();
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const form = useForm<FormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    await forgotPassword(data).then(() => {
      setIsSuccess(true);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("auth.emailLabel")}
                <span className="ml-1 text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("auth.emailPlaceholder")}
                  autoComplete="email"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4 w-full" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
