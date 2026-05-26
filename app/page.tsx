"use client";

import { useState } from "react";
import { ClubCard } from "@/components/club-card";
import { ClubModal } from "@/components/club-modal";
import { clubs, Club } from "@/lib/clubs-data";

// Each block has a fixed position (%) and size (px) on the canvas
// Scattered naturally across the entire page with spacing
const clubLayouts = [
  { top: "5%",    left: "4%",   width: 240, height: 180 },
  { top: "12%",   left: "68%",  width: 210, height: 160 },
  { top: "42%",   left: "3%",   width: 190, height: 170 },
  { top: "38%",   right: "5%",  width: 250, height: 200 },
  { bottom: "28%", left: "38%",  width: 220, height: 150 },
  { bottom: "25%", right: "12%", width: 200, height: 190 },
  { bottom: "5%",  left: "8%",   width: 230, height: 160 },
  { bottom: "6%",  right: "25%", width: 210, height: 180 },
];

export default function Home() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Scattered club blocks */}
      <div
        className="relative w-full"
        style={{ minHeight: "100vh" }}
        aria-label="社團色塊展示區"
      >
        {clubs.map((club, i) => {
          const layout = clubLayouts[i % clubLayouts.length];
          return (
            <div
              key={club.id}
              className="absolute"
              style={{ ...layout }}
            >
              <ClubCard
                club={club}
                onSelect={setSelectedClub}
                width={layout.width}
                height={layout.height}
              />
            </div>
          );
        })}

        {/* Centered title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance text-center"
            style={{ color: "oklch(0.25 0.02 260)" }}
          >
            社團總覽
          </h1>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <p className="text-center text-sm text-muted-foreground">
          © 2026 臺北市數位實驗高級中等學校學生自治會
        </p>
      </footer>

      <ClubModal club={selectedClub} onClose={() => setSelectedClub(null)} />
    </main>
  );
}
