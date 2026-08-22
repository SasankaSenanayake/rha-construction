export function ProcessSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step} className="relative rounded-sm border border-sand-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/60 hover:shadow-soft">
          <span className="font-serif text-4xl font-semibold text-gold-500">{String(index + 1).padStart(2, "0")}</span>
          <p className="mt-3 text-sm font-medium leading-relaxed text-ink-800">{step}</p>
        </li>
      ))}
    </ol>
  );
}
