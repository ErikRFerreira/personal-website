import type { Project } from '@/payload-types'
import { AccentHexagon } from '@/components/AccentHexagon'
import Link from 'next/link'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import LazyShapeGrid from '@/components/ShapeGrid/Lazy'
import { getRevealDelay } from '@/utilities/getRevealDelay'
import { ProjectRow } from './ProjectRow'

type SelectedProjectsProps = {
  eyebrow?: string | null
  label?: string | null
  intro?: string | null
  projects?: (number | Project)[] | null
}

export function SelectedProjectsBlock({ eyebrow, label, intro, projects }: SelectedProjectsProps) {
  const selectedProjects = projects?.filter(
    (project): project is Project => typeof project === 'object' && project !== null,
  )
  const resolvedEyebrow = eyebrow?.trim()
  const resolvedLabel = label?.trim() || (!resolvedEyebrow ? 'Selected Projects' : undefined)

  if (!selectedProjects?.length) return null

  return (
    <section
      className="site-section relative isolate overflow-hidden text-site-text-primary"
      data-selected-projects="true"
      data-theme="dark"
      style={{ backgroundColor: 'var(--site-surface-deep)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        data-selected-projects-grid="true"
      >
        <LazyShapeGrid
          borderColor="var(--site-border-control)"
          direction="diagonal"
          hoverFillColor="var(--site-surface-elevated)"
          hoverTrailAmount={0}
          shape="square"
          speed={0.2}
          squareSize={40}
        />
      </div>

      <div className="site-container relative z-10">
        <RevealOnScroll revealName="section-heading">
          <header className="mb-16 md:mb-24">
            <div className="mb-5 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <AccentHexagon />
                {resolvedEyebrow && (
                  <p className="site-section-label text-site-accent">{resolvedEyebrow}</p>
                )}
              </div>

              <Link
                className="text-sm font-bold tracking-[0.04em] text-site-text-secondary transition-colors duration-200 hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-site-border-active motion-reduce:transition-none"
                href="/projects"
              >
                View all
              </Link>
            </div>

            <div className="max-w-[42rem]">
              {resolvedLabel && (
                <h2 className="text-[2.625rem] leading-[0.95] font-extrabold tracking-normal text-site-text-primary md:text-[4.5rem]">
                  {resolvedLabel}
                </h2>
              )}

              {intro && (
                <p className="mt-8 border-l-2 border-site-accent pl-6 text-sm leading-[1.75] text-site-text-secondary md:text-lg">
                  {intro}
                </p>
              )}
            </div>
          </header>
        </RevealOnScroll>

        <div className="flex flex-col gap-16 lg:gap-24">
          {selectedProjects.map((project, index) => (
            <RevealOnScroll
              delay={getRevealDelay(index, 75, 225)}
              key={project.id}
              revealName="project-row"
            >
              <ProjectRow project={project} index={index} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
