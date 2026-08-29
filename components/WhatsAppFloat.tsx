import { whatsappHref } from "@/lib/site-config";

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3"
    >
      <span
        className="hidden md:inline-block whitespace-nowrap rounded-sm bg-noir text-paper text-xs
          tracking-wide uppercase px-3 py-2 opacity-0 translate-x-2
          transition-all duration-300 ease-signature
          group-hover:opacity-100 group-hover:translate-x-0"
      >
        Falar com a advogada
      </span>
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1F1F1F]
          shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-bronze/40
          transition-transform duration-300 ease-signature group-hover:scale-105"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 fill-bronze-light"
          aria-hidden="true"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.42-1.35a9.9 9.9 0 0 0 4.62 1.14h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 1.8c2.15 0 4.17.84 5.69 2.36a7.98 7.98 0 0 1 2.35 5.75c0 4.48-3.65 8.12-8.12 8.12a8.1 8.1 0 0 1-4.13-1.13l-.3-.17-3.22.8.86-3.14-.19-.32a8.02 8.02 0 0 1-1.24-4.29c0-4.48 3.65-8.12 8.12-8.12l.18.14Zm4.5 10.19c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.24-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.37-1.7-.14-.24-.02-.37.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.47-.01-.16 0-.43.06-.66.31-.23.24-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.16 1.73 2.65 4.2 3.71.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      </span>
    </a>
  );
}
