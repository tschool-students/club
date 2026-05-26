import type { Club } from "./club-data"

const SHEET_URL = process.env.CLUBS_SHEET_URL ?? ""

// ---------------------------------------------------------------------------
// CSV parser (RFC 4180, handles quoted fields with commas / newlines)
// ---------------------------------------------------------------------------

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim())
      current = ""
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function parseCSV(csvText: string): Record<string, string>[] {
  // Remove BOM
  const text = csvText.replace(/^﻿/, "")
  const lines = text.split(/\r?\n/)

  // Find header row: prefer a row where both "id" and "name" appear as exact cells
  // (handles sheets that have a human-readable row before the machine-readable header)
  let headerIndex = 0
  let headers: string[] = []

  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const cells = parseCSVLine(lines[i])
    const lower = cells.map((c) => c.toLowerCase().trim())
    if (lower.includes("id") && lower.includes("name")) {
      headerIndex = i
      headers = lower
      break
    }
  }

  if (!headers.length) {
    headers = parseCSVLine(lines[0]).map((c) => c.toLowerCase().trim())
  }

  const result: Record<string, string>[] = []

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue

    const cells = parseCSVLine(line)
    if (cells.every((c) => !c)) continue
    // Skip rows that look like a repeated header
    if (cells[0]?.toLowerCase() === headers[0]) continue

    const row: Record<string, string> = {}
    headers.forEach((header, idx) => {
      row[header] = cells[idx] ?? ""
    })
    result.push(row)
  }

  return result
}

// ---------------------------------------------------------------------------
// Row → Club converter
// ---------------------------------------------------------------------------

function parseSocialMedia(row: Record<string, string>) {
  const platforms = ["instagram", "facebook", "youtube", "discord", "line"]
  return platforms
    .filter((p) => row[p])
    .map((p) => ({
      platform: p.charAt(0).toUpperCase() + p.slice(1),
      url: row[p],
    }))
}

function parseOfficers(row: Record<string, string>) {
  const officers: { role: string; name: string }[] = []
  for (let i = 1; i <= 10; i++) {
    const role = row[`officer${i}_role`]
    const name = row[`officer${i}_name`]
    if (role && name) officers.push({ role, name })
  }
  return officers
}

function rowToClub(row: Record<string, string>, index: number): Club | null {
  const name = row["name"]?.trim()
  if (!name) return null

  const galleryRaw = row["gallery"]?.trim()
  const gallery = galleryRaw
    ? galleryRaw.split(/,|，|、/).map((s) => s.trim()).filter(Boolean)
    : undefined

  return {
    id: row["id"]?.trim() || `club-${index}`,
    name,
    description: row["description"]?.trim() ?? "",
    category: row["category"]?.trim() || "其他",
    charterUrl: row["charter_url"]?.trim() || undefined,
    coverImage: row["cover_image"]?.trim() || undefined,
    gallery,
    socialMedia: parseSocialMedia(row),
    officers: parseOfficers(row),
  }
}

// ---------------------------------------------------------------------------
// Debug info
// ---------------------------------------------------------------------------

export interface FetchDebug {
  sheetUrlConfigured: boolean
  sheetUrlPreview: string
  fetchStatus?: number
  fetchError?: string
  detectedHeaders?: string[]
  totalRows?: number
  parsedClubs?: number
  rawCsvPreview?: string
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchClubs(): Promise<{
  clubs: Club[]
  categories: string[]
  debug: FetchDebug
}> {
  if (!SHEET_URL) {
    return {
      clubs: [],
      categories: ["全部"],
      debug: {
        sheetUrlConfigured: false,
        sheetUrlPreview: "（未設定）",
      },
    }
  }

  const debug: FetchDebug = {
    sheetUrlConfigured: true,
    sheetUrlPreview:
      SHEET_URL.length > 80 ? SHEET_URL.slice(0, 80) + "…" : SHEET_URL,
  }

  try {
    const url = `${SHEET_URL}&t=${Date.now()}`
    const res = await fetch(url, {
      next: { revalidate: 300 },
    })

    debug.fetchStatus = res.status

    if (!res.ok) {
      debug.fetchError = `HTTP ${res.status} ${res.statusText}`
      return { clubs: [], categories: ["全部"], debug }
    }

    const csv = await res.text()
    debug.rawCsvPreview = csv.slice(0, 600)

    const rows = parseCSV(csv)
    debug.detectedHeaders = rows[0] ? Object.keys(rows[0]) : []
    debug.totalRows = rows.length

    const clubs = rows
      .map((row, i) => rowToClub(row, i))
      .filter((c): c is Club => c !== null)

    debug.parsedClubs = clubs.length

    const seen = new Set<string>()
    const categories: string[] = ["全部"]
    for (const club of clubs) {
      if (club.category && !seen.has(club.category)) {
        seen.add(club.category)
        categories.push(club.category)
      }
    }

    return { clubs, categories, debug }
  } catch (err) {
    debug.fetchError = String(err)
    return { clubs: [], categories: ["全部"], debug }
  }
}
