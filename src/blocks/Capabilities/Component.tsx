import CapabilityCard from '@/components/CapabilityCard'
import DefaultSection from '@/components/DefaultSection'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { getRevealDelay } from '@/utilities/getRevealDelay'

type Props = {
  eyebrow?: string | null
  label?: string | null
  intro?: string | null
  capabilities?:
    | {
        name: string
        description: string
        icon: {
          url: string
        }
      }[]
    | null
}

function Capabilities({ eyebrow, label, intro, capabilities }: Props) {
  return (
    <DefaultSection
      eyebrow={eyebrow}
      label={label}
      intro={intro}
      bgColor="var(--site-surface-elevated)"
      className="capabilities-section border-b border-[rgb(46_52_71/30%)]"
      revealHeader
    >
      {Array.isArray(capabilities) && capabilities.length > 0 && (
        <div className="border-t border-[rgb(46_52_71/30%)] pt-20">
          <div className="grid grid-cols-1 items-stretch gap-(--site-card-gap) md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, i) => (
              <RevealOnScroll
                className="h-full [&>div]:h-full"
                delay={getRevealDelay(i, 90, 270)}
                key={i}
                revealName="capability-card"
              >
                <CapabilityCard
                  name={capability.name}
                  description={capability.description}
                  icon={capability.icon}
                />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      )}
    </DefaultSection>
  )
}

export default Capabilities
