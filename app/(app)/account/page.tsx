import { Metadata } from "next";
import { getUserProfile } from "@/lib/auth";
import { AccountContent } from "@/components/AccountContent";

export const metadata: Metadata = {
  title: "My Account - Moshzion Pizza",
  description: "Manage your profile, addresses, payment methods, and view order history."
};

export default async function AccountPage() {
  const user = await getUserProfile();

  return <AccountContent user={user} />;
}
