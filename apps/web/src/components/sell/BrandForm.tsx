"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSubmitBrand, useMyBrand } from "@/lib/brand";
import { BrandFormValues, brandFormSchema } from "@/types/brand";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export function BrandForm() {
  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      instagramUrl: "",
    },
  });

  const router = useRouter();

  const { isSuccess: hasBrand } = useMyBrand();
  const { mutate, isSuccess: isBrandSubmitted } = useSubmitBrand();

  useEffect(() => {
    if (hasBrand) {
      router.push("/dashboard");
    }
  }, [hasBrand, router]);

  const onSubmit = (data: BrandFormValues) => {
    mutate(data);
    if (isBrandSubmitted) {
      toast.success("Brand submitted successfully!");
      router.push("/sell/dashboard");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your brand name" {...field} />
              </FormControl>
              <FormDescription>
                This is your brand's public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your brand and what makes it unique..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Give customers a brief overview of your brand's story and
                values.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contact@yourbrand.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This email will be used for brand-related communications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagramUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://instagram.com/yourbrand"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional: Link your Instagram profile to showcase your brand.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Brand Information</Button>
      </form>
    </Form>
  );
}
