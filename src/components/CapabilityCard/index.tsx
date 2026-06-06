type Props = {
  name: string
  description: string
  icon: {
    url: string
  }
}

function CapabilityCard({ name, description, icon }: Props) {
  return (
    <div className="rounded-site-card flex h-full flex-col border border-[rgb(46_52_71/30%)] bg-[rgb(12_19_36/30%)] p-10 transition-[background-color] duration-200 ease-out hover:bg-[rgb(12_19_36/50%)] motion-reduce:transition-none">
      <div className="flex flex-col gap-2.75">
        <img src={icon.url} alt="" aria-hidden className="h-5.5 w-auto self-start" />
        <h3 className="text-base font-bold text-site-text-primary">{name}</h3>
        <p className="text-sm leading-[1.7] text-site-text-secondary">{description}</p>
      </div>
    </div>
  )
}

export default CapabilityCard
