"use client";

import { useState } from "react";

export default function Accordion({
  items,
}: {
  items: { question: string; answer: string; category?: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-hairline-dark border-t border-b border-hairline-dark">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-start justify-between gap-6 py-6 text-left group"
            >
              <div>
                {item.category && (
                  <span className="code-label mb-2 block">{item.category}</span>
                )}
                <span className="font-display text-lg md:text-xl text-ink group-hover:text-bronze-dim transition-colors">
                  {item.question}
                </span>
              </div>
              <span
                className={`mt-2 shrink-0 font-mono text-xl text-bronze transition-transform duration-300 ease-signature ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-400 ease-signature ${
                isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
              }`}
              style={{ display: "grid" }}
            >
              <div className="overflow-hidden">
                <p className="text-mist leading-relaxed max-w-prose text-[15px]">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
