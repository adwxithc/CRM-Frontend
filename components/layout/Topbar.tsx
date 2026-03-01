"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// ─── Types ────────────────────────────────────────────────────────────────────
type TopbarProps = {
  onMenuToggle: () => void;
};

// ─── Page title from pathname ─────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/contacts": "Contacts",
  "/deals": "Deals",
  "/reports": "Reports",
  "/settings": "Settings",
};

function usePageTitle() {
  const pathname = usePathname();
  const segment = "/" + pathname.split("/").filter(Boolean)[0];
  return PAGE_TITLES[segment] ?? "CRM Platform";
}

// ─── Mock user ────────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Alex Johnson",
  email: "alex@company.com",
  avatarUrl: "",
  initials: "AJ",
};

// ─── UserMenu ─────────────────────────────────────────────────────────────────
function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open user menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {MOCK_USER.initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        {/* User info */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold leading-none">
              {MOCK_USER.name}
            </p>
            <p className="text-xs text-muted-foreground leading-none mt-1">
              {MOCK_USER.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-destructive focus:text-destructive">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Notifications button ────────────────────────────────────────────────────
function NotificationsButton() {
  return (
    <div className="relative">
      <Button variant="ghost" size="icon" aria-label="Notifications" className="h-8 w-8">
        <Bell className="h-4 w-4" />
      </Button>
      {/* Mock unread badge */}
      <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] leading-none pointer-events-none">
        3
      </Badge>
    </div>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
export function Topbar({ onMenuToggle }: TopbarProps) {
  const pageTitle = usePageTitle();

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Hamburger — mobile only */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden h-8 w-8"
        aria-label="Open navigation menu"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title */}
      <h1 className="text-base font-semibold tracking-tight text-foreground">
        {pageTitle}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right cluster */}
      <div className="flex items-center gap-2">
        {/* Search — hidden on small screens */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search…"
            className="h-8 w-48 pl-8 text-sm bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring lg:w-56"
          />
        </div>

        <NotificationsButton />
        <UserMenu />
      </div>
    </header>
  );
}
