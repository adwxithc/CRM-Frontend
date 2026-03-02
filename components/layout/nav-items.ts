import {
  LayoutDashboard,
  Users,
  Activity,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export type NavGroup = {
  label?: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Contacts", href: "/contacts", icon: Users },
      { label: "Activity Log", href: "/activity-logs", icon: Activity },
    ],
  },
];

