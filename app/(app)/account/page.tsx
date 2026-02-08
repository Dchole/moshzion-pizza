import { getUserProfile } from "@/lib/auth";
import { AccountContent } from "@/components/AccountContent";

export default async function AccountPage() {
  const user = await getUserProfile();

  return <AccountContent user={user} />;
}
