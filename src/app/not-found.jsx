"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
// import logo from "./image.png";

/**
 * NotFoundPanel: 404 panel for farm-pilot.
 * Self-contained in /components (logo is imported from ./assets, so nothing
 * is needed in /public). No changes to page.js / layout.js.
 *
 * Props
 *   homeHref   string   where "Back to home" goes (default "/")
 *   links      [{ label, href }]  optional quick links (default none)
 *   fullScreen boolean  fill the viewport with the page background (default true).
 *                       Set false if your layout already provides the background.
 */

const c = {
  green: "#29BF12",
  yellow: "#FFB100",
  bg: "#F5F0F6",
  soft: "#FEF4DD",
  text: "#364A24",
};

/** The "0" of 404, drawn as a round field with furrow rows. */
function FieldZero({ className }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={className}
      role="img"
      aria-label="Zero, drawn as a ploughed field"
    >
      <defs>
        <clipPath id="fp-field-clip">
          <circle cx="80" cy="80" r="64" />
        </clipPath>
      </defs>
      <circle cx="80" cy="80" r="64" fill={c.soft} />
      <g clipPath="url(#fp-field-clip)" fill="none" strokeLinecap="round">
        <path d="M-10 70 Q80 40 170 70" stroke={c.yellow} strokeWidth="9" />
        <path d="M-10 92 Q80 62 170 92" stroke={c.green} strokeWidth="9" />
        <path d="M-10 114 Q80 84 170 114" stroke={c.yellow} strokeWidth="9" />
        <path d="M-10 136 Q80 106 170 136" stroke={c.green} strokeWidth="9" />
        <path d="M-10 158 Q80 128 170 158" stroke={c.yellow} strokeWidth="9" />
      </g>
      <circle cx="80" cy="80" r="64" fill="none" stroke={c.text} strokeWidth="12" />
    </svg>
  );
}

export default function NotFoundPanel({
  homeHref = "/",
  links = [],
  fullScreen = true,
}) {
  const router = useRouter();

  return (
    <div
      className={`flex w-full items-center justify-center px-4 py-10 ${
        fullScreen ? "min-h-screen" : ""
      }`}
      style={{ backgroundColor: fullScreen ? c.bg : "transparent" }}
    >
      <main
        className="w-full max-w-xl overflow-hidden rounded-3xl bg-white text-center"
        style={{
          boxShadow:
            "0 1px 2px rgba(54,74,36,0.08), 0 12px 32px rgba(54,74,36,0.08)",
        }}
      >
        {/* Brand strip */}
        <div
          className="flex justify-center px-6 pb-6 pt-8"
          style={{ backgroundColor: c.soft }}
        >
          <div
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: "rgba(54,74,36,0.15)", backgroundColor: "#F7F7F0" }}
          >
            {/* <Image
              src={"./image.png"}
              alt="farm-pilot: Intelligent Agricultural Navigation"
              width={128}
              height={128}
              priority
              className="h-28 w-28 object-contain sm:h-32 sm:w-32"
            /> */}
          </div>
        </div>

        {/* Message */}
        <div className="px-6 pb-8 pt-7 sm:px-10">
          <div
            className="flex items-center justify-center gap-1 sm:gap-2"
            style={{ color: c.text }}
            aria-label="Error 404"
          >
            <span aria-hidden="true" className="text-8xl font-extrabold leading-none sm:text-9xl">
              4
            </span>
            <FieldZero className="h-24 w-24 sm:h-32 sm:w-32" />
            <span aria-hidden="true" className="text-8xl font-extrabold leading-none sm:text-9xl">
              4
            </span>
          </div>

          <h1
            className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: c.text }}
          >
            This page is off the map
          </h1>
          <p
            className="mx-auto mt-2 max-w-md text-sm leading-relaxed sm:text-base"
            style={{ color: c.text, opacity: 0.8 }}
          >
            We couldn&apos;t find the page you were looking for. It may have moved,
            or the link may be wrong. Head back to farm-pilot to get on course.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors hover:bg-[#FEF4DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB100]"
              style={{ color: c.text, borderColor: "rgba(54,74,36,0.3)" }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Go back
            </button>
            <Link
              href={homeHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB100] focus-visible:ring-offset-2"
              style={{ backgroundColor: c.green, color: c.text }}
            >
              <Home size={16} aria-hidden="true" />
              Back to home
            </Link>
          </div>

          {links.length > 0 && (
            <nav
              aria-label="Helpful pages"
              className="mt-7 flex flex-wrap items-center justify-center gap-2 border-t pt-6"
              style={{ borderColor: "rgba(54,74,36,0.1)" }}
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB100]"
                  style={{ backgroundColor: c.soft, color: c.text }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </main>
    </div>
  );
}