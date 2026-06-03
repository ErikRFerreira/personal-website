'use client'

import { cn } from '@/utilities/ui'
import React, { useEffect, useRef, useState } from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'
import { ImageMedia } from '../ImageMedia'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const { onClick, playWhenActive, resource, videoClassName, videoPlaybackActive, videoSrc } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const mediaResource = resource && typeof resource === 'object' ? resource : null
  const resourceIsVideo = mediaResource?.mimeType?.includes('video')
  const fallbackResource = mediaResource && !resourceIsVideo ? mediaResource : null
  const src = getMediaUrl(
    videoSrc ||
      mediaResource?.url ||
      (mediaResource?.filename ? `/media/${mediaResource.filename}` : ''),
  )
  const poster = fallbackResource
    ? getMediaUrl(fallbackResource.url, fallbackResource.updatedAt)
    : undefined
  const showFallback = failedSrc === src
  const shouldAutoPlay = !playWhenActive

  useEffect(() => {
    if (!playWhenActive) return

    const video = videoRef.current

    if (!video) return

    if (videoPlaybackActive) {
      void video.play().catch(() => {
        // Ignore browser-level playback rejections. The video will remain paused.
      })
      return
    }

    video.pause()
  }, [playWhenActive, videoPlaybackActive, src])

  if (showFallback && fallbackResource) {
    return <ImageMedia {...props} resource={fallbackResource} />
  }

  if (src) {
    return (
      <video
        autoPlay={shouldAutoPlay}
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        onError={() => setFailedSrc(src)}
        playsInline
        poster={poster}
        ref={videoRef}
      >
        <source onError={() => setFailedSrc(src)} src={src} />
      </video>
    )
  }

  return null
}
