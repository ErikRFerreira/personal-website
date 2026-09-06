// Shared defaults for Payload rich-text fields; layout stays with the containing section.
export const richTextProseClassName = [
  'font-sans text-base leading-relaxed font-light text-site-text-secondary break-words',
  '[&_h1]:mt-12 [&_h1]:mb-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-site-text-primary md:[&_h1]:text-4xl',
  '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-site-text-primary md:[&_h2]:text-3xl',
  '[&_h3]:mt-10 [&_h3]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:tracking-tight [&_h3]:text-site-text-primary md:[&_h3]:text-2xl',
  '[&_h4]:mt-8 [&_h4]:mb-3 [&_h4]:font-mono [&_h4]:text-xs [&_h4]:font-semibold [&_h4]:tracking-wider [&_h4]:text-site-accent [&_h4]:uppercase',
  '[&_p]:my-4 [&_strong]:font-semibold [&_strong]:text-site-text-primary',
  '[&_a]:text-site-accent [&_a]:underline [&_a]:decoration-site-border-active [&_a]:underline-offset-4 [&_a:hover]:text-site-accent-hover [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-site-accent',
  '[&_blockquote]:my-10 [&_blockquote]:border-l-2 [&_blockquote]:border-site-accent [&_blockquote]:bg-site-surface-elevated/30 [&_blockquote]:py-3 [&_blockquote]:pr-4 [&_blockquote]:pl-6 [&_blockquote]:font-medium [&_blockquote]:text-site-text-primary md:[&_blockquote]:text-lg [&_blockquote]:before:content-none [&_blockquote]:after:content-none [&_blockquote_p]:my-0',
  '[&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_li]:pl-1 [&_li::marker]:text-site-accent',
  '[&_hr]:my-10 [&_hr]:border-site-border-subtle [&_code]:font-mono [&_code]:text-sm [&_code]:text-site-text-primary',
  '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
].join(' ')
