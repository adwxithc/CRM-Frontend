import {
  LayoutDashboard,
  Users,
  Handshake,
  BarChart3,
  Settings,
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
      { label: "Contacts", href: "/contacts", icon: Users, badge: 4 },
      { label: "Deals", href: "/deals", icon: Handshake },
      { label: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];
