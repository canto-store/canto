"use client";
import React from "react";
import { useAuth } from "@/hooks/auth";
import { redirect } from "next/navigation";
import { Seller } from "@/types/user";

export default function Page() {
  const { user, logout: logoutMutation } = useAuth();

  if (!user) {
    redirect("/sell/register");
  }

  if (user.role !== "SELLER") {
    logoutMutation.mutateAsync(undefined);
    redirect("/sell/register");
  }

  if ((user as Seller).brandId) {
    redirect("/sell/products");
  }

  redirect("/sell/brand");

  return <></>;
}
