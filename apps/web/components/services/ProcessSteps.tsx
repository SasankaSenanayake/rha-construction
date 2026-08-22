export function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step} className="relative rounded-none bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
          <span className="font-display text-4xl font-semibold text-ink-900/15">{String(index + 1).padStart(2, "0")}</span>
          <p className="mt-3 text-sm font-medium leading-relaxed text-ink-800">{step}</p>
        </li>
      ))}
    </ol>
  );
}
