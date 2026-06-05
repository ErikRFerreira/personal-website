type Props = {
  name: string
  description: string
  icon: {
    url: string
  }
}

function CapabilityCard({ name, description, icon }: Props) {
  return (
    <div className="rounded-site-card flex h-full flex-col border border-site-border-subtle bg-site-surface-elevated px-8 pt-8 pb-[60px] transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-out hover:border-site-border-active hover:shadow-site-glow motion-reduce:transition-none">
      <div className="flex flex-col gap-[11px]">
        <img src={icon.url} alt="" aria-hidden className="h-[22px] w-auto self-start" />
        <h3 className="text-base font-bold text-site-text-primary">{name}</h3>
        <p className="text-sm leading-[1.7] text-site-text-secondary">{description}</p>
      </div>
    </div>
  )
}

export default CapabilityCard
