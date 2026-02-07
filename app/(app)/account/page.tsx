import { getCurrentUser } from "@/lib/auth";
import { AccountContent } from "@/components/AccountContent";

export default async function AccountPage() {
  const user = await getCurrentUser();

  return <AccountContent user={user} />;
}
