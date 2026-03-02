import type { Metadata } from "next";
import { ActivityLogsClient } from "@/components/activity/ActivityLogsClient";

export const metadata: Metadata = {
  title: "Activity Log | CRM Platform",
};

export default function ActivityLogsPage() {
  return <ActivityLogsClient />;
}
