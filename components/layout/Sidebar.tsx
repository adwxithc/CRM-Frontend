"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navGroups } from "./nav-items";

// ─── Types ────────────────────────────────────────────────────────────────────
type SidebarProps = {
  /** mobile sheet open state — controlled by DashboardShell */
  mobileOpen: boolean;
  onMobileClose: () => void;
};

// ─── Shared logo ─────────────────────────────────────────────────────────────
function SidebarLogo() {
  return (
    <div className="flex items-center gap-3 px-4 py-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
        <span className="text-sm font-bold text-primary-foreground">C</span>
      </div>
      <span className="text-base font-semibold tracking-tight text-sidebar-foreground">
        CRM Platform
      </span>
    </div>
  );
}

// ─── Shared nav list ─────────────────────────────────────────────────────────
function NavList({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navGroups.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-0.5">
          {group.label && !collapsed && (
            <p className="mb-1 mt-4 px-2 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 first:mt-2">
              {group.label}
            </p>
          )}
          {!group.label && gi > 0 && (
            <Separator className="my-3 bg-sidebar-border" />
          )}
          {group.items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive
                      ? "text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "ml-auto h-5 min-w-5 px-1.5 text-[11px]",
                          isActive && "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                    {item.badge !== undefined && (
                      <span className="ml-1.5 text-muted-foreground">
                        ({item.badge})
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return <div key={item.href}>{linkContent}</div>;
          })}
        </div>
      ))}
    </nav>
  );
}

// ─── Desktop sidebar ─────────────────────────────────────────────────────────
function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 border-r border-sidebar-border bg-sidebar">
      <SidebarLogo />
      <Separator className="bg-sidebar-border" />
      <div className="flex-1 overflow-y-auto py-3">
        <NavList />
      </div>
      <Separator className="bg-sidebar-border" />
      <div className="p-4">
        <p className="text-[11px] text-sidebar-foreground/40 text-center">
          v1.0.0
        </p>
      </div>
    </aside>
  );
}

// ─── Mobile sidebar (sheet) ───────────────────────────────────────────────────
function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="left" className="w-60 p-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <SheetHeader className="p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarLogo />
        </SheetHeader>
        <Separator className="bg-sidebar-border" />
        <div className="flex-1 overflow-y-auto py-3">
          <NavList />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar open={mobileOpen} onClose={onMobileClose} />
    </>
  );
}
