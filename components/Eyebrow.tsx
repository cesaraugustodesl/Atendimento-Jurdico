export default function Eyebrow({
  code,
  children,
  tone = "light",
}: {
  code?: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        tone === "dark" ? "text-bronze-light" : "text-bronze"
      }`}
    >
      {code && (
        <span className="font-mono text-[11px] tracking-widest2 uppercase">
          {code}
        </span>
      )}
      <span
        className={`h-px w-8 ${tone === "dark" ? "bg-bronze-light/60" : "bg-bronze/60"}`}
      />
      <span className="font-mono text-[11px] tracking-widest2 uppercase">
        {children}
      </span>
    </div>
  );
}
