"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAnnouncement } from "./actions";

export function DeleteAnnouncementButton({
  announcementId,
  title,
}: {
  announcementId: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function onDelete() {
    if (!confirm(`Delete "${title}"? Residents will stop seeing it. This is logged.`)) return;
    const fd = new FormData();
    fd.set("announcementId", announcementId);
    start(async () => {
      const res = await deleteAnnouncement(null, fd);
      if (res.ok) {
        toast.success("Announcement deleted");
        router.refresh();
      } else {
        toast.error("Couldn't delete", { description: res.error });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      aria-label={`Delete announcement ${title}`}
      className="text-xs px-2 py-1 rounded-md border border-border hover:border-red-500/60 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
