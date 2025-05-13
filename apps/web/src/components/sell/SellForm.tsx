"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const FormSchema = z
  .object({
    name: z.string().min(1, { message: "First name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone_number: z.string().min(1, { message: "Phone number is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, {
        message: "Password must contain at least one letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[@$!%*?&]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof FormSchema>;

export function SellForm() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sellerForm = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/api/seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone_number: values.phone_number,
          password: values.password,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error ?? "Failed to register seller");
      }
    } catch (error) {
      console.error("Error registering seller:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...sellerForm}>
      <form onSubmit={sellerForm.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <FormField
            control={sellerForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("sell.name")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder={t("sell.namePlaceholder")} {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={sellerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("sell.email")}
                  <span className="text-red-500">*</span>
                </FormLabel>
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
            control={sellerForm.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("sell.phone")}
                  <span className="text-red-500">*</span>
                </FormLabel>
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
            control={sellerForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("auth.password")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={sellerForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("auth.confirmPasswordLabel")}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("auth.confirmPasswordPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="mt-6 w-full"
          disabled={isSubmitting || sellerForm.formState.isSubmitting}
        >
          Sign Up
        </Button>
        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isSubmitting || sellerForm.formState.isSubmitting}
          variant="outline"
        >
          Already signed up? Sign In
        </Button>
      </form>
    </Form>
  );
}
