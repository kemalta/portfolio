import type { ReactNode } from "react";
import { MaskedLines } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title: ReactNode[];
  description?: string;
  note?: string;
  className?: string;
  titleClassName?: string;
  id?: string;
};

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  note,
  className,
  titleClassName,
  id,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "grid grid-cols-1 gap-8 border-t border-line pt-6 lg:grid-cols-12 lg:gap-10",
        className,
      )}
    >
      <div className="lg:col-span-3">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center border border-line font-mono text-[10px] tracking-[0.08em] text-cyan">
            {index}
          </span>
          <span className="label">{eyebrow}</span>
        </div>
        {note ? (
          <p className="mt-4 max-w-[16rem] font-mono text-[10px] leading-relaxed tracking-[0.12em] text-faint uppercase">
            {note}
          </p>
        ) : null}
      </div>

      <div className="lg:col-span-6">
        <MaskedLines
          as="h2"
          id={id}
          lines={title}
          className={cn(
            "text-[clamp(2.1rem,4.4vw,3.9rem)] leading-[0.98] tracking-[-0.04em]",
            titleClassName,
          )}
        />
      </div>

      {description ? (
        <div className="lg:col-span-3 lg:pt-1">
          <p className="max-w-sm text-sm leading-relaxed text-dim">{description}</p>
        </div>
      ) : null}
    </header>
  );
}
