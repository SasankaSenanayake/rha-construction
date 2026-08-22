import type { ReactNode } from "react";

export function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-charcoal-800">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClassName =
  "w-full rounded border border-concrete-200 px-3 py-2.5 text-sm text-charcoal-900 focus:border-safety-orange focus:outline-none focus:ring-1 focus:ring-safety-orange";
