import type { AboutTimelineBlock as AboutTimelineBlockProps } from '@/payload-types'

export type Milestone = AboutTimelineBlockProps['milestones'][number]

export const getMilestoneKey = (milestone: Milestone, index: number) =>
  milestone.id ?? `${milestone.year}-${index}`
