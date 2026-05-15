type Props = {
  name: string
  description: string
  icon: {
    url: string
  }
}

function CapabilityCard({ name, description, icon }: Props) {
  return (
    <div className="portfolio-card portfolio-transition flex h-full flex-col px-8 pt-8 pb-[60px] hover:border-portfolio-border-active hover:shadow-portfolio-glow">
      <div className="flex flex-col gap-[11px]">
        <img src={icon.url} alt="" aria-hidden className="h-[22px] w-auto self-start" />
        <h3 className="text-base font-bold text-portfolio-text-primary">{name}</h3>
        <p className="portfolio-body-sm">{description}</p>
      </div>
    </div>
  )
}

export default CapabilityCard
