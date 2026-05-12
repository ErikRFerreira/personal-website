type Props = {
  name: string
  description: string
  icon: {
    url: string
  }
}

function CapabilityCard({ name, description, icon }: Props) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#2E3447] bg-[#191F31] px-8 pt-8 pb-[60px]">
      <div className="flex flex-col gap-[11px]">
        <img src={icon.url} alt="" aria-hidden className="h-[22px] w-auto self-start" />
        <h3 className="text-base font-bold text-white">{name}</h3>
        <p className="text-sm leading-relaxed text-slate-300">{description}</p>
      </div>
    </div>
  )
}

export default CapabilityCard
