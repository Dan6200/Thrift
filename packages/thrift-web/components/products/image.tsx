//cspell:ignore CldImage, cloudinary
'use client'
import { CldImage } from 'next-cloudinary'
import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { ImgData } from '@/types/products'
import { cn } from '@/lib/utils'

export function ProductImage({
  className,
  imgData,
  width,
  height,
}: {
  className: string
  width: number
  height: number
  imgData: ImgData | undefined
}) {
  const [errored, setErrored] = useState(false)
  const src = imgData?.filepath

  if (!src || errored) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className,
        )}
      >
        <ImageOff className="w-8 h-8" />
      </div>
    )
  }

  const alt = imgData?.description ?? imgData?.filename ?? 'Product image'
  const style = {
    objectFit: 'cover' as const,
    objectPosition: 'center' as const,
  }
  const onError = () => setErrored(true)

  // Absolute URLs (e.g. plain http(s) image links) are rendered directly.
  if (/^https?:\/\//.test(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={style}
        onError={onError}
      />
    )
  }

  // Otherwise treat the path as a Cloudinary public ID.
  return (
    <CldImage
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={style}
      onError={onError}
    />
  )
}
