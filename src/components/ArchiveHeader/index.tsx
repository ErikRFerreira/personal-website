import styles from './ArchiveHeader.module.css'

type ArchiveHeaderProps = {
  detail?: string
  subtitle?: string
  title: string
}

function ArchiveHeader({ detail, title, subtitle }: ArchiveHeaderProps) {
  return (
    <header className="mb-16 flex w-full max-w-3xl flex-col items-start md:mb-24">
      {detail && (
        <p
          className={`${styles.detail} mb-5 font-mono text-[0.6875rem] leading-none font-bold tracking-[0.18em] text-site-accent uppercase`}
        >
          {detail}
        </p>
      )}
      <h1
        className={`${styles.title} text-2xl leading-[1.08] font-bold tracking-tighter text-site-text-primary md:text-6xl`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`${styles.subtitle} mt-6 text-base leading-[1.7] text-site-text-secondary md:text-lg`}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}

export default ArchiveHeader
