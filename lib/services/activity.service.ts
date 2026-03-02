import { api } from "@/lib/api";
import type { Activity, ActivitiesResponse, Pagination } from "@/lib/types";

// ─── Response types ───────────────────────────────────────────────────────────

export type GetActivitiesResult = {
  data: Activity[];
  pagination: Pagination;
};

// ─── Service ──────────────────────────────────────────────────────────────────

export const activityService = {
  /**
   * GET /api/activity
   * Returns a paginated list of activity log entries (newest first).
   */
  async getActivities(page = 1, limit = 20): Promise<GetActivitiesResult> {
    const { data } = await api.get<ActivitiesResponse>("/api/activity", {
      params: { page, limit },
    });
    return { data: data.data, pagination: data.pagination };
  },
};
