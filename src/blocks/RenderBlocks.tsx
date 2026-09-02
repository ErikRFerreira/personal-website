import React, { Fragment, Suspense } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SimpleTextBlock } from '@/blocks/SimpleText/Component'
import { SelectedProjectsBlock } from '@/blocks/SelectedProjects/Component'
import { InitiateProjectBlock } from '@/blocks/InitiateProject/Component'
import Capabilities from './Capabilities/Component'
import { LensBlockComponent } from './LensBlock/Component'
import { AboutIntroBlock } from './AboutIntro/Component'
import { AboutHeroBlock } from './AboutHero/Component'
import { AboutStoryBlock } from './AboutStory/Component'
import { AboutDisciplinesBlock } from './AboutDisciplines/Component'
import { AboutProtocolBlock } from './AboutProtocol/Component'
import { AboutTimelineBlock } from './AboutTimeline/Component'
import { RevealText } from './RevealText/Component'
import HomeBio from './HomeBio/Component'

const blockComponents = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  simpleText: SimpleTextBlock,
  selectedProjects: SelectedProjectsBlock,
  initiateProject: InitiateProjectBlock,
  capabilities: Capabilities,
  lensBlock: LensBlockComponent,
  aboutIntro: AboutIntroBlock,
  aboutHero: AboutHeroBlock,
  aboutStory: AboutStoryBlock,
  aboutDisciplines: AboutDisciplinesBlock,
  aboutProtocol: AboutProtocolBlock,
  aboutTimeline: AboutTimelineBlock,
  revealText: RevealText,
  homeBio: HomeBio,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  deferOffscreen?: boolean
}> = (props) => {
  const { blocks, deferOffscreen = false } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block
          const transitionFrom =
            blockType === 'lensBlock' && blocks[index - 1]?.blockType === 'revealText'
              ? 'revealText'
              : undefined
          const transitionTo =
            blockType === 'capabilities' && blocks[index + 1]?.blockType === 'revealText'
              ? 'revealText'
              : undefined

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div
                  className={deferOffscreen && index > 0 ? 'homepage-deferred-block' : undefined}
                  data-block-type={blockType}
                  data-deferred={deferOffscreen && index > 0 ? 'true' : undefined}
                  data-transition-from={transitionFrom}
                  data-transition-to={transitionTo}
                  key={block.id ?? index}
                >
                  <Suspense fallback={<div aria-hidden="true" className="min-h-24" />}>
                    {/* @ts-expect-error there may be some mismatch between the expected types here */}
                    <Block {...block} disableInnerContainer />
                  </Suspense>
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
