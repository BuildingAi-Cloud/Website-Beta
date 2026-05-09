import { redirect } from "next/navigation";

// /dashboard/account → /dashboard/settings — Account is now the
// Profile tab inside Settings. Redirect preserves old bookmarks +
// AccountMenu's previous accountHref.
export default function DashboardAccountPage() {
  redirect("/dashboard/settings");
}
