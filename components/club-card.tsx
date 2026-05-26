"use client";

import { useState } from "react";
import Image from "next/image";
import { Club } from "@/lib/clubs-data";

interface ClubCardProps {
  club: Club;
  onSelect: (club: Club) => void;
  width: number;
  height: number;
}

export function ClubCard({ club, onSelect, width, height }: ClubCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onSelect(club)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-xl overflow-hidden transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
      style={{
        width,
        height,
        backgroundColor: club.bgColor,
        boxShadow: isHovered
          ? "0 20px 50px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.1)"
          : "0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
      }}
      aria-label={`查看 ${club.name} 詳情`}
    >
      {/* Club image fades in on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <Image
          src={club.image}
          alt={club.name}
          fill
          className="object-cover"
          sizes="300px"
        />
        {/* gradient overlay so text stays readable */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${club.bgColor}f0 0%, ${club.bgColor}60 45%, transparent 100%)`,
          }}
        />
      </div>

      {/* Club name — always bottom-left */}
      <div className="absolute bottom-0 left-0 p-3 pr-4">
        <span
          className="font-bold leading-none block"
          style={{
            color: club.textColor,
            fontSize: Math.max(16, Math.min(width, height) * 0.13),
          }}
        >
          {club.name}
        </span>
      </div>
    </button>
  );
}
