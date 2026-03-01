import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | CRM Platform",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Good morning, Alex 👋
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Here&apos;s what&apos;s happening with your pipeline today.
        </p>
      </div>

      {/* Placeholder stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Contacts", value: "2,340", change: "+12%" },
          { label: "Open Deals", value: "48", change: "+4%" },
          { label: "Revenue (MTD)", value: "$84,200", change: "+8.2%" },
          { label: "Conversion Rate", value: "24.5%", change: "-1.1%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 flex flex-col gap-2"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  stat.change.startsWith("+")
                    ? "text-emerald-500"
                    : "text-destructive"
                }
              >
                {stat.change}
              </span>{" "}
              vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 min-h-64 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Activity chart — coming soon
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 min-h-64 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Recent activity — coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
