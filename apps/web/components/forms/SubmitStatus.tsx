import { Icon } from "@/components/ui/Icon";

export function SubmitStatus({ status, successMessage, errorMessage }: { status: "success" | "error"; successMessage: string; errorMessage: string }) {
  if (status === "success") {
    return (
      <p role="status" className="reveal reveal-visible flex items-start gap-2 rounded-sm border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
        {successMessage}
      </p>
    );
  }
  return (
    <p role="alert" className="reveal reveal-visible rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      {errorMessage}
    </p>
  );
}
