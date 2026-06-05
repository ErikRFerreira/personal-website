import React from 'react'
import { Mail, MapPin } from 'lucide-react'
import { Media } from '@/components/Media'
import { Tag } from '@/components/Tag'
import type { FormBlock } from '@/payload-types'

type QuickAccessCard = NonNullable<FormBlock['quickAccessCard']>

export const ContactCard: React.FC<QuickAccessCard> = ({
  avatar,
  email,
  jobTitle,
  location,
  name,
  responseTime,
  tags,
}) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <div className="rounded-site-card border border-site-border-subtle bg-site-surface-elevated p-[var(--site-card-padding)] backdrop-blur-sm">
      {/* Avatar + name */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
          {avatar && typeof avatar === 'object' ? (
            <Media fill imgClassName="object-cover" resource={avatar} size="56px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-site-surface-base text-sm font-semibold text-site-text-primary">
              {initials}
            </div>
          )}
        </div>
        <div>
          {name && <p className="text-base font-semibold text-site-text-primary">{name}</p>}
          {jobTitle && <p className="text-sm leading-[1.7] text-site-text-secondary">{jobTitle}</p>}
        </div>
      </div>

      {/* Contact details */}
      <div className="mb-6 space-y-3">
        {email && (
          <a
            className="flex items-center gap-3 text-sm text-site-text-secondary transition-[color,background-color,border-color,box-shadow,opacity,transform] duration-200 ease-out hover:text-site-accent focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-site-border-active focus-visible:shadow-[0_0_0_4px_var(--site-glow-accent)] motion-reduce:transition-none"
            href={`mailto:${email}`}
          >
            <Mail className="h-4 w-4 flex-shrink-0 text-site-accent" />
            <span>{email}</span>
          </a>
        )}
        {location && (
          <div className="flex items-center gap-3 text-sm text-site-text-secondary">
            <MapPin className="h-4 w-4 flex-shrink-0 text-site-accent" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map(({ id, label }) => (
            <Tag key={id ?? label} className="bg-transparent text-site-text-secondary">
              {label}
            </Tag>
          ))}
        </div>
      )}

      {/* Response time */}
      {responseTime && (
        <div className="flex items-center gap-2 border-t pt-4 text-sm text-site-text-secondary">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="italic">{responseTime}</span>
        </div>
      )}
    </div>
  )
}
