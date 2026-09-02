import SpotlightCard from '@/components/SpotlightCard'

type Props = {
  name: string
  description: string
  icon: {
    url: string
  }
}

function CapabilityCard({ name, description, icon }: Props) {
  return (
    <SpotlightCard className="custom-spotlight-card">
      <div className="flex flex-col">
        <img src={icon.url} alt="" aria-hidden className="mb-6 h-5.5 w-auto self-start" />
        <h3 className="text-base font-bold text-site-text-primary">{name}</h3>
        <p className="mt-3.5 text-sm leading-[1.7] text-site-text-secondary">{description}</p>
      </div>
    </SpotlightCard>
  )
}

export default CapabilityCard
