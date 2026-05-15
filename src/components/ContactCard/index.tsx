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
    <div className="portfolio-card portfolio-card-padding backdrop-blur-sm">
      {/* Avatar + name */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-portfolio-border-subtle">
          {avatar && typeof avatar === 'object' ? (
            <Media fill imgClassName="object-cover" resource={avatar} size="56px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-portfolio-base text-sm font-semibold text-portfolio-text-primary">
              {initials}
            </div>
          )}
        </div>
        <div>
          {name && <p className="text-base font-semibold text-portfolio-text-primary">{name}</p>}
          {jobTitle && <p className="portfolio-body-sm">{jobTitle}</p>}
        </div>
      </div>

      {/* Contact details */}
      <div className="mb-6 space-y-3">
        {email && (
          <a
            className="portfolio-focus-ring portfolio-transition flex items-center gap-3 text-sm text-portfolio-text-secondary hover:text-portfolio-accent"
            href={`mailto:${email}`}
          >
            <Mail className="h-4 w-4 flex-shrink-0 text-portfolio-accent" />
            <span>{email}</span>
          </a>
        )}
        {location && (
          <div className="flex items-center gap-3 text-sm text-portfolio-text-secondary">
            <MapPin className="h-4 w-4 flex-shrink-0 text-portfolio-accent" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map(({ id, label }) => (
            <Tag key={id ?? label} className="bg-transparent text-portfolio-text-secondary">
              {label}
            </Tag>
          ))}
        </div>
      )}

      {/* Response time */}
      {responseTime && (
        <div className="flex items-center gap-2 border-t border-portfolio-border-subtle pt-4 text-sm text-portfolio-text-secondary">
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
