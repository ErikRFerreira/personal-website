type Props = {
  eyebrow?: string | null
  label?: string | null
  children: React.ReactNode
}

function DefaultSection({ eyebrow, label, children }: Props) {
  return (
    <section className="bg-slate-950 px-6 py-16 text-white md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold tracking-normal md:text-4xl">{eyebrow}</h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">{label}</p>
        </div>

        <div className="space-y-10">{children}</div>
      </div>
    </section>
  )
}

export default DefaultSection
