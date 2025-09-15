"use client";

import { useGetBalance } from "@/lib/user";

function AccountPage() {
  const { data: balance } = useGetBalance();
  return <div>{balance}</div>;
}

export default AccountPage;
