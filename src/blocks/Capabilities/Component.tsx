import DefaultSection from '@/components/DefaultSection'
import CapabilityCard from '@/components/CapabilityCard'

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
    <DefaultSection eyebrow={eyebrow} label={label}>
      {Array.isArray(capabilities) && capabilities.length > 0 && (
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability, i) => (
            <CapabilityCard
              key={i}
              name={capability.name}
              description={capability.description}
              icon={capability.icon}
            />
          ))}
        </div>
      )}
    </DefaultSection>
  )
}

export default Capabilities
