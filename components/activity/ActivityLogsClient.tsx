"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserCog,
  UserMinus,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import type { Activity, ActivityAction, Pagination } from "@/lib/types";
import { activityService } from "@/lib/services/activity.service";

const PAGE_LIMIT = 20;

// ─── Action config ────────────────────────────────────────────────────────────

const ACTION_CONFIG: Record<
  ActivityAction,
  {
    label: string;
    verb: string;
    badgeClass: string;
    iconClass: string;
    Icon: React.ElementType;
  }
> = {
  ADD: {
    label: "Added",
    verb: "Added contact",
    badgeClass:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    iconClass: "bg-emerald-500/10 text-emerald-400",
    Icon: UserPlus,
  },
  EDIT: {
    label: "Edited",
    verb: "Edited contact",
    badgeClass:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    iconClass: "bg-blue-500/10 text-blue-400",
    Icon: UserCog,
  },
  DELETE: {
    label: "Deleted",
    verb: "Deleted contact",
    badgeClass:
      "bg-red-500/10 text-red-400 border-red-500/20",
    iconClass: "bg-red-500/10 text-red-400",
    Icon: UserMinus,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ActivitySkeleton() {
  return (
    <div className="flex flex-col divide-y divide-border">
      {Array.from({ length: 8 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
        <div key={i} className="flex items-start gap-4 px-6 py-4 animate-pulse">
          <div className="mt-0.5 h-9 w-9 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-14 rounded-full bg-muted" />
              <div className="h-4 w-48 rounded bg-muted" />
            </div>
            <div className="h-3.5 w-32 rounded bg-muted" />
            <div className="h-3 w-28 rounded bg-muted/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
      <Inbox className="h-10 w-10 opacity-30" />
      <p className="text-sm font-medium">No activity yet</p>
      <p className="text-xs">Actions on contacts will appear here.</p>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────

function ErrorState({
  message,
  onRetry,
}: Readonly<{ message: string; onRetry: () => void }>) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
      <AlertCircle className="h-10 w-10 text-destructive opacity-70" />
      <p className="text-sm font-medium text-destructive">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

// ─── Activity item ────────────────────────────────────────────────────────────

function ActivityItem({ activity }: Readonly<{ activity: Activity }>) {
  const cfg = ACTION_CONFIG[activity.action];
  const { Icon } = cfg;

  return (
    <div className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors">
      {/* Action icon */}
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${cfg.iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Top row: badge + message */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold px-2 py-0.5 shrink-0 ${cfg.badgeClass}`}
          >
            {cfg.label}
          </Badge>
          <span className="text-sm font-medium text-foreground">
            {cfg.verb}{" "}
            <span className="text-primary">{activity.contact.name}</span>
          </span>
        </div>

        {/* Contact email */}
        <p className="text-xs text-muted-foreground truncate">
          {activity.contact.email}
        </p>

        {/* Meta: user + timestamp */}
        <div className="flex items-center gap-2 mt-0.5">
          <Avatar className="h-4 w-4 shrink-0">
            <AvatarFallback className="text-[8px] bg-muted text-muted-foreground">
              {getInitials(activity.user)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-muted-foreground">
            {activity.user}
          </span>
          <span className="text-[11px] text-muted-foreground/50">·</span>
          <span className="text-[11px] text-muted-foreground">
            {formatTimestamp(activity.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination controls ──────────────────────────────────────────────────────

function PaginationControls({
  pagination,
  onPrev,
  onNext,
}: Readonly<{
  pagination: Pagination;
  onPrev: () => void;
  onNext: () => void;
}>) {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-3">
      <p className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{total}</span> activities
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onPrev}
          disabled={!pagination.hasPrevPage}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-muted-foreground px-2">
          {page} / {totalPages}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onNext}
          disabled={!pagination.hasNextPage}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ActivityLogsClient() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchActivities = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await activityService.getActivities(p, PAGE_LIMIT);
      setActivities(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load activity logs."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities(page);
  }, [page, fetchActivities]);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Activity Log</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {pagination
            ? `${pagination.total} total ${pagination.total === 1 ? "event" : "events"}`
            : "Track all contact activity across your CRM"}
        </p>
      </div>

      {/* ── Feed card ───────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {loading ? (
          <ActivitySkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchActivities(page)} />
        ) : activities.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="divide-y divide-border">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            {pagination && (
              <PaginationControls
                pagination={pagination}
                onPrev={() => setPage((p) => p - 1)}
                onNext={() => setPage((p) => p + 1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
