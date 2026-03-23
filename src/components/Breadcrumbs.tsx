import RouteLink from "./RouteLink";

interface BreadcrumbsProps {
  items: Array<{ name: string; path: string }>;
  onNavigate: (href: string) => void;
}

export default function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.path}-${item.name}`} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-slate-200">{item.name}</span>
              ) : (
                <RouteLink
                  href={item.path}
                  onNavigate={onNavigate}
                  className="hover:text-white"
                >
                  {item.name}
                </RouteLink>
              )}
              {!isLast && <span>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
