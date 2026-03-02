import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthErrorAlertProps = {
  message: string;
  onDismiss?: () => void;
  className?: string;
};

export function AuthErrorAlert({
  message,
  onDismiss,
  className,
}: AuthErrorAlertProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive",
        className
      )}
    >
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <p className="flex-1 leading-snug">{message}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
