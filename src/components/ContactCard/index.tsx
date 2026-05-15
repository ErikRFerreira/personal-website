import React from 'react'
import { Mail, MapPin } from 'lucide-react'
import { Media } from '@/components/Media'
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
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-sm">
      {/* Avatar + name */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-white/10">
          {avatar && typeof avatar === 'object' ? (
            <Media fill imgClassName="object-cover" resource={avatar} size="56px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-700 text-sm font-semibold text-white">
              {initials}
            </div>
          )}
        </div>
        <div>
          {name && <p className="text-base font-semibold text-white">{name}</p>}
          {jobTitle && <p className="text-sm text-slate-400">{jobTitle}</p>}
        </div>
      </div>

      {/* Contact details */}
      <div className="mb-6 space-y-3">
        {email && (
          <a
            className="flex items-center gap-3 text-sm text-slate-300 transition-colors hover:text-cyan-400"
            href={`mailto:${email}`}
          >
            <Mail className="h-4 w-4 flex-shrink-0 text-cyan-400" />
            <span>{email}</span>
          </a>
        )}
        {location && (
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <MapPin className="h-4 w-4 flex-shrink-0 text-cyan-400" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {tags.map(({ id, label }) => (
            <span
              key={id ?? label}
              className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Response time */}
      {responseTime && (
        <div className="flex items-center gap-2 border-t border-white/10 pt-4 text-sm text-slate-400">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="italic">{responseTime}</span>
        </div>
      )}
    </div>
  )
}
