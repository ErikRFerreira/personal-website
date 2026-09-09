import { ProjectPrinciplesBlock } from '@/blocks/ProjectPrinciples/Component'
import type { Project } from '@/payload-types'

export function RenderProjectBlocks({ blocks }: { blocks: Project['detailBlocks'] }) {
  if (!blocks?.length) return null

  return blocks.map((block, index) => {
    if (block.blockType !== 'projectPrinciples') return null

    return <ProjectPrinciplesBlock key={block.id ?? index} {...block} />
  })
}
