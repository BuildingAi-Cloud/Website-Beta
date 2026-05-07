import { prisma } from "@/lib/prisma";
import type { NotificationItem } from "@/components/NotificationBell";

// Builds the notification feed for the current user. Reads existing tables
// (no separate Notification model) — work-order status changes (residents
// see their own; staff see all in their building) + new announcements.

const STAFF_ROLES = new Set(["building_manager", "facility_manager", "concierge"]);
const TAKE = 8;

interface AppUserLite {
  id: string;
  role: string;
  buildingId: string | null;
}

export async function getNotifications(appUser: AppUserLite): Promise<NotificationItem[]> {
  if (!appUser.buildingId) return [];

  const isStaff = STAFF_ROLES.has(appUser.role);
  const [workOrders, announcements] = await Promise.all([
    prisma.workOrder.findMany({
      where: isStaff
        ? { buildingId: appUser.buildingId }
        : { openedById: appUser.id },
      orderBy: { updatedAt: "desc" },
      take: TAKE,
      select: { id: true, issue: true, status: true, unit: true, updatedAt: true },
    }),
    prisma.announcement.findMany({
      where: { buildingId: appUser.buildingId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: TAKE,
      select: { id: true, title: true, createdAt: true },
    }),
  ]);

  const woItems: NotificationItem[] = workOrders.map((wo) => ({
    id: `wo-${wo.id}`,
    kind: "work_order",
    title: wo.issue,
    meta: `${wo.status.replace("_", " ")}${wo.unit ? ` · Unit ${wo.unit}` : ""}`,
    href: isStaff ? "/team/work-orders" : "/dashboard/maintenance",
    createdAt: wo.updatedAt.toISOString(),
  }));

  const annItems: NotificationItem[] = announcements.map((a) => ({
    id: `ann-${a.id}`,
    kind: "announcement",
    title: a.title,
    meta: "Announcement",
    href: isStaff ? "/team/announcements" : "/dashboard/announcements",
    createdAt: a.createdAt.toISOString(),
  }));

  return [...woItems, ...annItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
}
