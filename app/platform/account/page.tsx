import { redirect } from "next/navigation";

// /platform/account → /platform/settings — Account is now the Profile
// tab inside Settings.
export default function PlatformAccountPage() {
  redirect("/platform/settings");
}
