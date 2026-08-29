import Link from "next/link";

export default function Breadcrumbs({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <nav aria-label="breadcrumb" className="text-xs">
      <ol className="flex flex-wrap items-center gap-2 text-mist">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-2">
            {i > 0 && <span className="text-mist-light">/</span>}
            {i === items.length - 1 ? (
              <span className="text-ink">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-bronze transition-colors">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
