'use client'

import { useState, useRef, MouseEvent } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface ZoomableGalleryProps {
  images: readonly string[]
  title: string
}

export function ZoomableGallery({ images, title }: ZoomableGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  
  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const mainImageRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current || !isZoomed) return
    const { left, top, width, height } = mainImageRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPos({ x, y })
  }

  const handleMouseEnter = () => setIsZoomed(true)
  const handleMouseLeave = () => {
    setIsZoomed(false)
    setZoomPos({ x: 50, y: 50 })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        ref={mainImageRef}
        className="relative w-full aspect-square bg-brand-cream rounded-2xl overflow-hidden cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - View ${activeIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={cn(
                "object-cover transition-transform duration-200 ease-out",
                isZoomed ? "scale-[2]" : "scale-100"
              )}
              style={{
                transformOrigin: isZoomed ? `${zoomPos.x}% ${zoomPos.y}%` : 'center center'
              }}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden bg-brand-cream transition-all",
                activeIndex === idx ? "ring-2 ring-brand-gold ring-offset-2" : "opacity-60 hover:opacity-100"
              )}
              aria-label={`View image ${idx + 1}`}
              aria-current={activeIndex === idx ? 'true' : 'false'}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 12vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
