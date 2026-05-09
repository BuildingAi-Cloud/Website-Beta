import { redirect } from "next/navigation";

// /team/account → /team/settings — Account is now the Profile tab
// inside Settings. Keep this redirect so old bookmarks and the
// AccountMenu's previous accountHref still resolve.
export default function TeamAccountPage() {
  redirect("/team/settings");
}
