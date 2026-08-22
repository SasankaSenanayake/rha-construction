export function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step} className="relative rounded border border-concrete-200 bg-white p-5">
          <span className="text-3xl font-bold text-safety-orange">{String(index + 1).padStart(2, "0")}</span>
          <p className="mt-3 text-sm font-medium text-charcoal-800">{step}</p>
        </li>
      ))}
    </ol>
  );
}
