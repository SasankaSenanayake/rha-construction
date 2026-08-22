export function PageHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "text-center" : ""}>
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sand-600">{eyebrow}</p>}
      <h1 className={`font-display text-4xl font-semibold text-ink-900 md:text-5xl ${eyebrow ? "mt-3" : ""}`}>
        {title}
      </h1>
      <div className={`accent-rule mt-5 w-16 ${centered ? "mx-auto" : ""}`} />
      {subtitle && (
        <p className={`mt-5 text-sand-600 ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{subtitle}</p>
      )}
    </div>
  );
}
