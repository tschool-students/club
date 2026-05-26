"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Users, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import type { Club } from "@/lib/club-data"

/* ── Accent palette ──────────────────────────────────────────────────────────
   Curated high-saturation colours that still feel editorial against the warm
   canvas background (#f2f0e9). Each entry pairs a vivid block colour with a
   foreground that meets WCAG AA contrast.
   ─────────────────────────────────────────────────────────────────────────── */
interface Accent {
  bg:   string  // block background
  text: string  // foreground for name / category
}

const ACCENTS: Accent[] = [
  { bg: "#E63946", text: "#FFFFFF" },  // coral red
  { bg: "#1D4ED8", text: "#FFFFFF" },  // cobalt blue
  { bg: "#0F8B65", text: "#FFFFFF" },  // jade green
  { bg: "#F59E0B", text: "#1A1A1A" },  // marigold
  { bg: "#7C3AED", text: "#FFFFFF" },  // royal violet
  { bg: "#0EA5E9", text: "#FFFFFF" },  // azure
  { bg: "#FACC15", text: "#1A1A1A" },  // citrine yellow
  { bg: "#DB2777", text: "#FFFFFF" },  // magenta
]

const ASPECTS = ["aspect-[3/4]", "aspect-[4/3]", "aspect-[1/1]"] as const

function pickAccent(seed: string, index: number): Accent {
  const sum = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0) + index
  return ACCENTS[Math.abs(sum) % ACCENTS.length]
}

/* ── Social icon helper ───────────────────────────────────────────────────── */
function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "instagram":
      return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    case "facebook":
      return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    case "youtube":
      return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      )
    case "discord":
      return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </svg>
      )
    case "line":
      return (
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      )
    default:
      return <ExternalLink className="h-3.5 w-3.5" />
  }
}

/* ── Component ────────────────────────────────────────────────────────────── */
interface ClubCardProps {
  club:    Club
  index?:  number
  width?:  number  // scattered layout: fixed px; absent → auto via aspect ratio
  height?: number
}

export function ClubCard({ club, index = 0, width, height }: ClubCardProps) {
  const [dialogOpen, setDialogOpen]         = useState(false)
  const [isHovered, setIsHovered]           = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const accent     = pickAccent(club.category, index)
  const allImages  = [club.coverImage, ...(club.gallery || [])].filter(Boolean) as string[]
  const isScattered = width !== undefined && height !== undefined

  // Font size scales with card dimensions on scattered layout
  const nameFontSize = isScattered
    ? Math.max(16, Math.min(width!, height!) * 0.14)
    : undefined

  // CSS aspect ratio for mobile/tablet columns layout
  const aspectClass = ASPECTS[index % 3]

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)

  // Light-text accents need a slightly stronger shadow to keep depth on hover
  const isLightText = accent.text === "#FFFFFF"

  return (
    <>
      {/* ── Card — solid colour block by default, image fades in on hover ── */}
      <button
        onClick={() => setDialogOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={[
          "relative overflow-hidden rounded-xl",
          "transition-all duration-300 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "cursor-pointer",
          // Mobile/tablet: full-width with aspect ratio
          !isScattered ? `w-full ${aspectClass}` : "",
        ].join(" ")}
        style={
          isScattered
            ? {
                width,
                height,
                backgroundColor: accent.bg,
                transform: isHovered ? "scale(1.04)" : "scale(1)",
                boxShadow: isHovered
                  ? `0 18px 40px ${isLightText ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.18)"}`
                  : `0 4px 14px ${isLightText ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.10)"}`,
              }
            : { backgroundColor: accent.bg }
        }
        aria-label={`查看 ${club.name} 詳情`}
      >
        {/* Image layer — fades in on hover */}
        {club.coverImage && (
          <div
            className="absolute inset-0 transition-opacity duration-[400ms]"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <Image
              src={club.coverImage}
              alt={club.name}
              fill
              className="object-cover object-center"
              sizes={isScattered ? "300px" : "(max-width: 640px) 100vw, 50vw"}
            />
            {/* Gradient overlay in the accent colour so name stays readable */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${accent.bg}f0 0%, ${accent.bg}66 45%, transparent 100%)`,
              }}
            />
          </div>
        )}

        {/* Category label — top-left */}
        <div className="absolute top-3 left-3 right-3 z-10">
          <span
            className="text-[10px] font-medium uppercase tracking-[0.14em]"
            style={{ color: accent.text, opacity: 0.75 }}
          >
            {club.category}
          </span>
        </div>

        {/* Club name — always visible, bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
          <span
            className="font-bold leading-tight block"
            style={{
              color: accent.text,
              fontSize: nameFontSize ?? "clamp(16px, 4vw, 22px)",
            }}
          >
            {club.name}
          </span>
        </div>
      </button>

      {/* ── Detail Dialog ────────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-2xl overflow-hidden rounded-xl p-0 gap-0 border-0"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{club.name} 社團資訊</DialogTitle>
          </DialogHeader>

          <div className="flex max-h-[90vh] flex-col overflow-hidden">

            {/* Header — image or colour block */}
            <div className="relative h-48 md:h-64 shrink-0" style={{ backgroundColor: accent.bg }}>
              {allImages.length > 0 && (
                <>
                  <Image
                    src={allImages[currentImageIndex]}
                    alt={club.name}
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${accent.bg} 0%, ${accent.bg}88 40%, transparent 100%)`,
                    }}
                  />
                </>
              )}

              {/* Multi-image navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="上一張"
                    className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper-white/80 text-graphite backdrop-blur-sm transition-colors hover:bg-paper-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="下一張"
                    className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-paper-white/80 text-graphite backdrop-blur-sm transition-colors hover:bg-paper-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-14 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={"h-1 rounded-full transition-all duration-200 " + (idx === currentImageIndex ? "w-6 bg-paper-white" : "w-1 bg-paper-white/50")}
                        aria-label={`前往第 ${idx + 1} 張`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Club name overlaid on header */}
              <div className="absolute bottom-4 left-6 right-6 z-10">
                <p
                  className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.14em]"
                  style={{ color: `${accent.text}cc` }}
                >
                  {club.category}
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold leading-tight"
                  style={{ color: accent.text }}
                >
                  {club.name}
                </h2>
              </div>

              {/* Close button */}
              <button
                onClick={() => setDialogOpen(false)}
                aria-label="關閉"
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-paper-white/80 text-graphite backdrop-blur-sm transition-colors hover:bg-paper-white"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content — scrollable, accent background */}
            <div
              className="overflow-y-auto p-6 space-y-6"
              style={{ backgroundColor: accent.bg }}
            >
              {/* Description */}
              <section>
                <h3
                  className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em]"
                  style={{ color: `${accent.text}cc` }}
                >
                  社團簡介
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: accent.text }}
                >
                  {club.description}
                </p>
              </section>

              {/* Charter */}
              {club.charterUrl && (
                <section>
                  <h3
                    className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em]"
                    style={{ color: `${accent.text}cc` }}
                  >
                    章程
                  </h3>
                  <a
                    href={club.charterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-light transition-colors duration-150"
                    style={{
                      borderColor: `${accent.text}55`,
                      color:       accent.text,
                    }}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    社團章程
                    <ExternalLink className="h-3 w-3 opacity-50" />
                  </a>
                </section>
              )}

              {/* Social media */}
              {club.socialMedia.length > 0 && (
                <section>
                  <h3
                    className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em]"
                    style={{ color: `${accent.text}cc` }}
                  >
                    社群媒體
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {club.socialMedia.map((social) => (
                      <a
                        key={social.platform}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-light transition-colors duration-150"
                        style={{
                          borderColor: `${accent.text}55`,
                          color:       accent.text,
                        }}
                      >
                        {getSocialIcon(social.platform)}
                        {social.platform}
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* Officers */}
              {club.officers.length > 0 && (
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: accent.text }} />
                    <h3
                      className="text-[11px] font-medium uppercase tracking-[0.14em]"
                      style={{ color: `${accent.text}cc` }}
                    >
                      幹部名單
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {club.officers.map((officer) => (
                      <div
                        key={officer.role}
                        className="rounded-xl p-3"
                        style={{ backgroundColor: `${accent.text}1f` }}
                      >
                        <p
                          className="text-[11px] font-medium"
                          style={{ color: `${accent.text}cc` }}
                        >
                          {officer.role}
                        </p>
                        <p
                          className="mt-1 text-[13px] font-semibold"
                          style={{ color: accent.text }}
                        >
                          {officer.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
