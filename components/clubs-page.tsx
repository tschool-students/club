"use client"

import { useEffect, useState } from "react"
import { ClubCard } from "@/components/club-card"
import type { Club } from "@/lib/club-data"
import type { FetchDebug } from "@/lib/fetch-clubs"
import { AlertTriangle, ExternalLink } from "lucide-react"

interface ClubsPageProps {
  initialClubs: Club[]
  initialCategories: string[]
  debug: FetchDebug
}

// ── Scattered layout ─────────────────────────────────────────────────────────
// 3 columns with deterministic vertical offsets — no randomness, SSR-safe
const COL_CONFIG = [
  { leftPct: 5,  topOffset: 0   },  // left   — anchored to row start
  { leftPct: 37, topOffset: 110 },  // center — offset 110px down
  { leftPct: 67, topOffset: 55  },  // right  — offset 55px down
] as const

// Card size templates — mix of landscape (w>h), portrait (h>w) and near-square.
// 3 sizes per column cycle deterministically by row to stay SSR-safe.
const COL_SIZES = [
  // left column
  [
    { w: 240, h: 180 },  // landscape
    { w: 195, h: 250 },  // portrait
    { w: 215, h: 210 },  // near-square
  ],
  // center column
  [
    { w: 205, h: 265 },  // portrait
    { w: 250, h: 170 },  // landscape
    { w: 220, h: 235 },  // portrait-ish
  ],
  // right column
  [
    { w: 235, h: 175 },  // landscape
    { w: 185, h: 245 },  // portrait
    { w: 225, h: 200 },  // landscape
  ],
] as const

const ROW_HEIGHT    = 440  // px — vertical spacing between rows
const NAV_HEIGHT    = 64   // sticky nav (h-16)
const HEADER_OFFSET = 80   // breathing room above the first row in virtual canvas
const VIRTUAL_WIDTH = 1440 // design-time canvas width — scaled to fit any viewport

function getSlotLayout(slotIndex: number) {
  const col = slotIndex % 3
  const row = Math.floor(slotIndex / 3)
  const { w, h } = COL_SIZES[col][row % 3]
  return {
    // leftPct is interpreted against VIRTUAL_WIDTH so positions scale predictably
    leftPx: (COL_CONFIG[col].leftPct / 100) * VIRTUAL_WIDTH,
    top:    row * ROW_HEIGHT + COL_CONFIG[col].topOffset + HEADER_OFFSET,
    width:  w,
    height: h,
  }
}

// Reserve the most centrally-located slot for the title so cards never overlap
// the heading. Falls back to slot 0 only when there are no clubs.
function pickTitleSlot(numClubs: number): number {
  const totalSlots = numClubs + 1
  const numRows    = Math.ceil(totalSlots / 3)
  const middleRow  = Math.floor((numRows - 1) / 2)
  return Math.min(middleRow * 3 + 1, Math.max(0, totalSlots - 1))
}

export function ClubsPage({ initialClubs, initialCategories: _, debug }: ClubsPageProps) {
  // Pick the slot whose grid position is closest to the canvas centre
  const TITLE_SLOT = pickTitleSlot(initialClubs.length)
  const getCardSlot = (cardIndex: number) =>
    cardIndex >= TITLE_SLOT ? cardIndex + 1 : cardIndex

  // Virtual canvas height = bottom edge of the lowest occupied slot + small pad.
  // Includes the title slot itself so the canvas always has room for the heading.
  const BOTTOM_PADDING = 80
  const totalSlots = initialClubs.length + 1
  const allBottoms: number[] = []
  for (let i = 0; i < totalSlots; i++) {
    const l = getSlotLayout(i)
    allBottoms.push(l.top + l.height)
  }
  const virtualHeight = Math.max(...allBottoms, 600) + BOTTOM_PADDING

  // Compute scale on mount + window resize so the virtual canvas fits the
  // available area (viewport minus nav). Capped at 1 so we never up-scale.
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const recalc = () => {
      const availH = window.innerHeight - NAV_HEIGHT
      const availW = window.innerWidth
      setScale(Math.min(availW / VIRTUAL_WIDTH, availH / virtualHeight, 1))
    }
    recalc()
    window.addEventListener("resize", recalc)
    return () => window.removeEventListener("resize", recalc)
  }, [virtualHeight])

  return (
    <div
      className="bg-canvas text-graphite overflow-hidden"
      style={{ height: "100vh" }}
    >

      {/* ── Navigation ── */}
      <nav className="h-16 bg-canvas/95 backdrop-blur-sm border-b border-ink-black/10">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex flex-col leading-none gap-0.5">
            <span className="text-[14px] font-normal tracking-tight text-graphite">
              數位實驗高中
            </span>
            <span className="text-[10px] font-light tracking-[0.14em] uppercase text-ash-gray">
              Clubs · 社團總覽
            </span>
          </a>
          <div className="flex items-center gap-2.5">
            <a
              href="https://tschool-students.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 rounded-full border border-ink-black px-4 text-[12px] font-light text-graphite transition-colors duration-150 hover:bg-graphite hover:text-paper-white"
            >
              學生會官網
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* ── Mobile / Tablet layout (hidden lg+) ── */}
      <div
        className="lg:hidden columns-1 sm:columns-2 [column-gap:1.5rem] px-5 sm:px-8 pt-10 pb-16 overflow-y-auto"
        style={{ height: `calc(100vh - ${NAV_HEIGHT}px)` }}
      >
        {initialClubs.length === 0 && (
          <DebugPanel debug={debug} />
        )}
        {initialClubs.map((club, idx) => (
          <div key={club.id} className="break-inside-avoid mb-5">
            <ClubCard club={club} index={idx} />
          </div>
        ))}
      </div>

      {/* ── Desktop scattered canvas — locked to a single viewport ── */}
      <main
        className="hidden lg:flex relative w-full items-center justify-center overflow-hidden bg-canvas"
        style={{ height: `calc(100vh - ${NAV_HEIGHT}px)` }}
      >
        {/* Error / empty state */}
        {initialClubs.length === 0 && (
          <div className="flex w-full max-w-xl items-center justify-center px-8">
            <DebugPanel debug={debug} />
          </div>
        )}

        {/* Virtual canvas — scaled uniformly via CSS transform so everything
            fits the available area without scrolling. */}
        {initialClubs.length > 0 && (
          <div
            className="relative shrink-0"
            style={{
              width:  VIRTUAL_WIDTH,
              height: virtualHeight,
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            {/* Centred title — guaranteed centre of the virtual canvas (both axes) */}
            <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-10">
              <h1
                className="text-[80px] xl:text-[108px] font-bold text-center text-graphite"
                style={{ letterSpacing: "-0.04em", lineHeight: 0.9 }}
              >
                社團總覽
              </h1>
            </div>

            {/* Absolutely positioned club cards — TITLE_SLOT is skipped */}
            {initialClubs.map((club, idx) => {
              const layout = getSlotLayout(getCardSlot(idx))
              return (
                <div
                  key={club.id}
                  className="absolute"
                  style={{ left: layout.leftPx, top: layout.top }}
                >
                  <ClubCard
                    club={club}
                    index={idx}
                    width={layout.width}
                    height={layout.height}
                  />
                </div>
              )
            })}
          </div>
        )}
      </main>

    </div>
  )
}

// ── Debug panel (only shown when clubs fail to load) ─────────────────────────
function DebugPanel({ debug }: { debug: FetchDebug }) {
  return (
    <div className="rounded-xl border border-terracotta/30 bg-terracotta/5 p-6">
      <div className="mb-4 flex items-center gap-2 text-graphite">
        <AlertTriangle className="h-4 w-4 shrink-0 text-terracotta" />
        <span className="text-[14px] font-medium">資料載入失敗 · Debug 資訊</span>
      </div>
      <dl className="space-y-2.5 font-mono text-[12px]">
        <div className="flex gap-3">
          <dt className="w-36 shrink-0 text-ash-gray">CLUBS_SHEET_URL</dt>
          <dd className={debug.sheetUrlConfigured ? "break-all text-graphite" : "text-terracotta"}>
            {debug.sheetUrlPreview}
          </dd>
        </div>
        {debug.fetchStatus !== undefined && (
          <div className="flex gap-3">
            <dt className="w-36 shrink-0 text-ash-gray">HTTP Status</dt>
            <dd className={debug.fetchStatus === 200 ? "text-deep-forest" : "text-terracotta"}>
              {debug.fetchStatus}
            </dd>
          </div>
        )}
        {debug.fetchError && (
          <div className="flex gap-3">
            <dt className="w-36 shrink-0 text-ash-gray">錯誤訊息</dt>
            <dd className="break-all text-terracotta">{debug.fetchError}</dd>
          </div>
        )}
        {debug.detectedHeaders && debug.detectedHeaders.length > 0 && (
          <div className="flex gap-3">
            <dt className="w-36 shrink-0 text-ash-gray">偵測到的欄位</dt>
            <dd className="break-all text-graphite">{debug.detectedHeaders.join(", ")}</dd>
          </div>
        )}
        {debug.totalRows !== undefined && (
          <div className="flex gap-3">
            <dt className="w-36 shrink-0 text-ash-gray">CSV 資料列數</dt>
            <dd className="text-graphite">{debug.totalRows}</dd>
          </div>
        )}
        {debug.parsedClubs !== undefined && (
          <div className="flex gap-3">
            <dt className="w-36 shrink-0 text-ash-gray">成功解析社團</dt>
            <dd className={debug.parsedClubs > 0 ? "text-deep-forest" : "text-terracotta"}>
              {debug.parsedClubs}
            </dd>
          </div>
        )}
        {debug.rawCsvPreview && (
          <div className="mt-4 flex flex-col gap-2">
            <dt className="text-ash-gray">原始 CSV（前 600 字元）</dt>
            <dd>
              <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-xl bg-canvas p-4 text-[11px] leading-relaxed text-graphite">
                {debug.rawCsvPreview}
              </pre>
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}
