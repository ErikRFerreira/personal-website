import CapabilityCard from '@/components/CapabilityCard'
import DefaultSection from '@/components/DefaultSection'

type Props = {
  eyebrow?: string | null
  label?: string | null
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

function Capabilities({ eyebrow, label, capabilities }: Props) {
  return (
    <DefaultSection
      eyebrow={eyebrow}
      label={label}
      bgColor="var(--site-surface-elevated)"
      className="border-b border-[rgb(46_52_71/30%)]"
    >
      {Array.isArray(capabilities) && capabilities.length > 0 && (
        <div className="border-t border-[rgb(46_52_71/30%)] pt-20">
          <div className="grid grid-cols-1 items-stretch gap-[var(--site-card-gap)] md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability, i) => (
              <CapabilityCard
                key={i}
                name={capability.name}
                description={capability.description}
                icon={capability.icon}
              />
            ))}
          </div>
        </div>
      )}
    </DefaultSection>
  )
}

export default Capabilities
