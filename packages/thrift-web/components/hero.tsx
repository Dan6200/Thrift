'use client'
import { cn } from '@/lib/utils'
import AnimatedText from './ui/animated-text'
import { useAtomValue } from 'jotai'
import { isSmallScreenAtom } from '@/atoms'
import { getCldVideoUrl } from 'next-cloudinary'
import { Montagu_Slab } from 'next/font/google'

const font = Montagu_Slab({ weight: '500', subsets: ['latin'] })

const dim = {
  width: 1920,
  height: 1080,
}
const videoSrc = getCldVideoUrl({
  ...dim,
  src: 'sellit-media/hero/laptop-unboxing-hd', // Public ID of your video
})

export function Hero({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const text = 'Create lasting|memories shopping|with Thrift.'
  const delim = '|'
  return (
    <div className="h-screen">
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="z-0 absolute top-0 h-screen w-full object-cover"
        poster="/laptop-unboxing-hd.jpg"
      />
      <div
        className={cn(
          'text-3xl sm:text-5xl md:text-5xl xl:text-7xl capitalize p-4 md:p-16 bg-foreground/60 dark:bg-background/60 inset-0 top-0 absolute font-extrabold z-5 flex h-full text-left items-start justify-end',
          className,
          font?.className,
        )}
      >
        <AnimatedText text={text} delim={delim} />
        {children}
      </div>
    </div>
  )
}
