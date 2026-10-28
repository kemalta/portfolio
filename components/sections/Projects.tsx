"use client";

import { useState } from "react";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ProjectPreview } from "@/components/projects/ProjectPreview";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects, type Project } from "@/lib/site";
import { cn } from "@/lib/utils";

const layouts: Record<Project["visual"], "split" | "reverse" | "banner"> = {
  topology: "split",
  monitoring: "reverse",
  soc: "banner",
  ai: "split",
  creative: "reverse",
};

export function Projects() {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <section
      id="projeler"
      aria-labelledby="projeler-title"
      className="relative py-20 sm:py-24 lg:py-28"
    >
      <div className="shell">
        <SectionHeader
          index="04"
          eyebrow="Projects / Concepts"
          id="projeler-title"
          title={[
            <span key="line-1">Fikirlerin</span>,
            <span key="line-2">
              <span className="serif text-cyan">çalışan</span> hâlleri.
            </span>,
          ]}
          description="Aşağıdaki beş çalışma, bu portföy için tasarlanmış interaktif konsept demolarıdır. Örnek veriyle çalışır; gerçek müşteri işi, üretim sistemi veya tamamlanmış ticari proje olarak sunulmaz."
          note="Konsept · örnek veri · çalışan demo"
        />

        <div className="mt-6 flex flex-col gap-3 border border-amber/30 bg-amber/[0.045] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-amber/90">
            Şeffaflık notu: bu bölümdeki hiçbir çalışma geçmiş iş deneyimi
            iddiası taşımaz.
          </p>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
            05 konsept / hepsi tarayıcıda çalışır
          </span>
        </div>

        <div className="mt-14 flex flex-col gap-20 sm:gap-24 lg:gap-28">
          {projects.map((project) => {
            const layout = layouts[project.visual];
            return (
              <ProjectEntry
                key={project.id}
                project={project}
                layout={layout}
                onOpen={() => setOpenProject(project)}
              />
            );
          })}
        </div>
      </div>

      <ProjectModal
        project={openProject}
        onClose={() => setOpenProject(null)}
      />
    </section>
  );
}

function ProjectEntry({
  project,
  layout,
  onOpen,
}: {
  project: Project;
  layout: "split" | "reverse" | "banner";
  onOpen: () => void;
}) {
  const titleId = `project-${project.id}-title`;

  if (layout === "banner") {
    return (
      <article aria-labelledby={titleId} className="group">
        <div className="grid grid-cols-1 gap-x-10 gap-y-5 border-t border-line pt-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <ProjectMeta project={project} />
          </div>
          <div className="lg:col-span-6">
            <h3
              id={titleId}
              className="font-display text-[clamp(1.9rem,4vw,3.3rem)] font-medium leading-[0.98] tracking-[-0.04em] text-ink"
            >
              {project.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-dim">
              {project.description}
            </p>
          </div>
          <div className="lg:col-span-3 lg:pt-2">
            <OpenButton project={project} onOpen={onOpen} />
          </div>
        </div>

        <button
          type="button"
          onClick={onOpen}
          aria-label={`${project.title} demosunu aç`}
          className="relative mt-7 block w-full overflow-hidden border border-line bg-[#080c10] text-left transition-colors duration-300 hover:border-ink/25"
        >
          <div className="grid-bg-fine absolute inset-0 opacity-60" />
          <div className="relative aspect-[16/8] w-full p-5 sm:p-7 lg:aspect-[21/8] lg:p-9">
            <ProjectPreview visual={project.visual} />
          </div>
          <span className="pointer-events-none absolute right-4 top-4 border border-line bg-void/70 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink/70 backdrop-blur-sm transition-colors group-hover:border-cyan/40 group-hover:text-cyan">
            Demoyu aç ↗
          </span>
        </button>

        <TechRow project={project} className="mt-4" />
      </article>
    );
  }

  const reversed = layout === "reverse";

  return (
    <article aria-labelledby={titleId} className="group">
      <div
        className={cn(
          "grid grid-cols-1 items-start gap-8 border-t border-line pt-6 lg:grid-cols-12 lg:gap-10",
        )}
      >
        <div
          className={cn(
            "lg:col-span-5",
            reversed ? "lg:order-2 lg:col-start-8" : "lg:order-1",
          )}
        >
          <ProjectMeta project={project} />

          <h3
            id={titleId}
            className="mt-5 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-medium leading-[1.0] tracking-[-0.04em] text-ink"
          >
            {project.title}
          </h3>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            {project.subtitle}
          </p>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-dim">
            {project.description}
          </p>

          <TechRow project={project} className="mt-6" />

          <OpenButton project={project} onOpen={onOpen} className="mt-7" />
        </div>

        <div
          className={cn(
            "lg:col-span-7",
            reversed ? "lg:order-1" : "lg:order-2",
          )}
        >
          <button
            type="button"
            onClick={onOpen}
            aria-label={`${project.title} demosunu aç`}
            className="relative block w-full overflow-hidden border border-line bg-[#080c10] text-left transition-colors duration-300 hover:border-ink/25"
          >
            <div className="grid-bg-fine absolute inset-0 opacity-60" />
            <div className="relative aspect-[16/10] w-full p-4 sm:p-6">
              <ProjectPreview visual={project.visual} />
            </div>
            <span className="pointer-events-none absolute right-3 top-3 border border-line bg-void/70 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink/70 backdrop-blur-sm transition-colors group-hover:border-cyan/40 group-hover:text-cyan">
              Demoyu aç ↗
            </span>
          </button>

          <div className="mt-3 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-faint">
            <span>{project.tech.join(" · ")}</span>
            <span className="hidden sm:inline">statik önizleme</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectMeta({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-mono text-[10px] tracking-[0.14em] text-cyan">
        {project.index} / 05
      </span>
      <span className="h-3 w-px bg-line" />
      <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-amber/90">
        {project.note}
      </span>
    </div>
  );
}

function TechRow({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {project.tech.map((item) => (
        <li
          key={item}
          className="border border-line px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink/65"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function OpenButton({
  project,
  onOpen,
  className,
}: {
  project: Project;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "tap group/btn inline-flex items-center gap-3 border border-ink/25 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink transition-colors duration-200 hover:border-cyan/60 hover:text-cyan",
        className,
      )}
    >
      <span className="h-1 w-1 bg-cyan transition-transform duration-200 group-hover/btn:scale-150" />
      Konsept demoyu aç
      <span aria-hidden className="text-[11px] leading-none">
        ↗
      </span>
      <span className="sr-only"> — {project.title}</span>
    </button>
  );
}
