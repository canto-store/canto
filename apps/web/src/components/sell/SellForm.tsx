"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  storeName: z.string().min(1, { message: "Store name is required" }),
  instagramUrl: z
    .string()
    .min(1, { message: "Instagram URL is required" })
    .url({ message: "Instagram URL must be a valid URL" }),
});

type FormValues = z.infer<typeof FormSchema>;

export function SellForm() {
  const t = useTranslations();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      storeName: "",
      instagramUrl: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement API call to register seller
      console.log(values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/dashboard/seller");
    } catch (error) {
      console.error("Error registering seller:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("sell.firstName")}<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("sell.firstNamePlaceholder")} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("sell.lastName")}<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("sell.lastNamePlaceholder")} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sell.email")}<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder={t("sell.emailPlaceholder")} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sell.phone")}<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    type="tel"
                    placeholder={t("sell.phonePlaceholder")} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sell.storeName")}<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("sell.storeNamePlaceholder")} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagramUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("sell.instagramUrl")}<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("sell.instagramUrlPlaceholder")} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">{t("sell.agreement")}</p>

          <Button type="submit" className="w-full" disabled={isSubmitting || form.formState.isSubmitting}>
            {isSubmitting ? t("sell.submitting") : t("sell.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
