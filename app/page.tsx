import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          CRM Platform
        </h1>
        <p className="max-w-sm text-base text-muted-foreground">
          Manage your contacts, track activity, and grow your business.
        </p>
      </div>

      <Link
        href="/login"
        className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Go to Login
      </Link>

      <p className="text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="underline underline-offset-4 hover:text-foreground">
          Register
        </Link>
      </p>
    </div>
  );
}
