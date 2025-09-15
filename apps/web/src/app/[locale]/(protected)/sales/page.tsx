"use client";

import { useGetSales } from "@/lib/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet } from "lucide-react";
import { formatPrice } from "@/lib/utils";

function AccountPage() {
  const { data: sales, isLoading, isError, isSuccess } = useGetSales();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Sales</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <span>Current Balance</span>
            </CardTitle>
            <CardDescription>Your available funds</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : isError ? (
              <div className="text-red-500">
                Unable to fetch balance. Please try again.
              </div>
            ) : (
              isSuccess && (
                <div>
                  <p className="text-4xl font-bold">{formatPrice(sales)}</p>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your recent account activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground py-6 text-center">
              No recent transactions to display.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AccountPage;
