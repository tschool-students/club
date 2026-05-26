"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Users } from "lucide-react";
import { Club } from "@/lib/clubs-data";
import { Button } from "@/components/ui/button";

interface ClubModalProps {
  club: Club | null;
  onClose: () => void;
}

export function ClubModal({ club, onClose }: ClubModalProps) {
  useEffect(() => {
    if (club) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [club]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!club) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header Image */}
        <div className="relative h-48 md:h-64">
          <Image
            src={club.image}
            alt={club.name}
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${club.bgColor} 0%, ${club.bgColor}88 40%, transparent 100%)`,
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 bg-card/80 hover:bg-card rounded-full"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="absolute bottom-4 left-6 right-6">
            <h2
              id="modal-title"
              className="text-3xl md:text-4xl font-bold"
              style={{ color: club.textColor }}
            >
              {club.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto p-6 space-y-6"
          style={{
            maxHeight: "calc(90vh - 16rem)",
            backgroundColor: club.bgColor,
          }}
        >
          {/* Description */}
          <section>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: club.textColor }}
            >
              社團簡介
            </h3>
            <p
              className="leading-relaxed"
              style={{ color: `${club.textColor}cc` }}
            >
              {club.description}
            </p>
          </section>

          {/* Staff */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5" style={{ color: club.textColor }} />
              <h3
                className="text-lg font-semibold"
                style={{ color: club.textColor }}
              >
                幹部名單
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {club.staff.map((member, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: `${club.textColor}15`,
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: club.textColor }}
                  >
                    {member.position}
                  </p>
                  <p
                    className="text-base font-semibold mt-1"
                    style={{ color: `${club.textColor}dd` }}
                  >
                    {member.name}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Activities */}
          {club.activities && club.activities.length > 0 && (
            <section>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: club.textColor }}
              >
                社團活動
              </h3>
              <ul className="space-y-2">
                {club.activities.map((activity, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2"
                    style={{ color: `${club.textColor}cc` }}
                  >
                    <span style={{ color: club.textColor }}>•</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Meeting Time */}
          {club.meetingTime && (
            <section
              className="p-4 rounded-lg"
              style={{ backgroundColor: `${club.textColor}10` }}
            >
              <p className="text-sm" style={{ color: `${club.textColor}aa` }}>
                社團時間
              </p>
              <p
                className="font-semibold mt-1"
                style={{ color: club.textColor }}
              >
                {club.meetingTime}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
