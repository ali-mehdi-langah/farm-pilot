"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";


/**
 * Navbar - self-contained, lives entirely in components/.
 * Usage (from any component, never edit page.js / layout.js):
 *   import Navbar from "@/components/Navbar";
 *   <Navbar />
 *
 * Props (all optional):
 *   brand   - text shown next to the logo (default "Cultivo"; pass "" to show only the logo)
 *   links   - [{ key, label, href }] for the dark pill (Home is rendered with an icon)
 *   signInHref / signUpHref - destinations for the right-hand actions
 */

const DEFAULT_LINKS = [
  { key: "home", label: "Home", href: "/" },
  { key: "how-it-works", label: "How it Works", href: "#how-it-works" },
  { key: "centers", label: "Centers", href: "#centers" },
];

function Logo() {
  return (
    <Image
      src={"/image.png"}
      alt="Agricultural Procurement logo"
      height={60}
      width={60}
      priority
      className="h-[52px] w-auto"
    />
  );
}

function HomeIcon({ className = "" }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}

export default function Navbar({
  brand = "Farm Pilot",
  links = DEFAULT_LINKS,
  signInHref = "/login",
  signUpHref = "/sign-up",
}) {
  const pathname = usePathname();
  const [hashActive, setHashActive] = useState(null);
  const [open, setOpen] = useState(false);

  // Route links are active by pathname; hash links by last click. Home is the fallback.
  const routeMatch = links.find(
    (l) => !l.href.startsWith("#") && l.href === pathname && l.key !== "home"
  );
  const activeKey = hashActive || routeMatch?.key || "home";

  const handleClick = (link) => {
    if (link.href.startsWith("#")) setHashActive(link.key);
    else setHashActive(null);
    setOpen(false);
  };


    const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const supabase = createClient();
  
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      setUser(user);
      setLoading(false);
    }
  
    getUser();
  }, []);

  return (
    <header className="w-full bg-[#f1f2f4] font-[Manrope,ui-sans-serif,system-ui,sans-serif]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');`}</style>

      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-[#14181a]">
          <Logo />
          {brand && (
            <span className="text-[22px] font-medium tracking-tight">{brand}</span>
          )}
        </Link>

        {/* Center pill (desktop) */}
        <ul className="hidden items-center gap-1 rounded-full bg-primary p-[5px] md:flex">
          {links.map((link) => {
            const active = link.key === activeKey;
            return (
              <li key={link.key}>
                <Link
                  href={link.href}
                  onClick={() => handleClick(link)}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#14181a] transition-colors"
                      : "flex items-center rounded-full px-3.5 py-2 text-[13px] font-medium text-white/90 transition-colors hover:text-white"
                  }
                >
                  {link.key === "home" && <HomeIcon />}
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions (desktop) */}
        <div className="hidden items-center gap-5 md:flex">
          {user ? (
            <>
            <Link
            href={"/dashboard"}
            className="rounded-full border border-[#14181a]/70 px-6 py-2.5 text-[13px] font-medium text-[#14181a] transition-colors hover:bg-[#14181a] hover:text-white"
          >
            Dashboard
          </Link>
            </>
          ):(
            <>
            <Link
            href={signInHref}
            className="text-[13px] font-medium text-[#14181a] hover:opacity-70"
          >
            Sign In
          </Link>
          <Link
            href={signUpHref}
            className="rounded-full border border-[#14181a]/70 px-6 py-2.5 text-[13px] font-medium text-[#14181a] transition-colors hover:bg-[#14181a] hover:text-white"
          >
            Sign up Free
          </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d282a] text-white md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="mx-6 mb-4 rounded-3xl bg-[#1d282a] p-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active = link.key === activeKey;
              return (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    onClick={() => handleClick(link)}
                    className={
                      active
                        ? "flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[#14181a]"
                        : "flex items-center rounded-full px-4 py-2.5 text-sm font-medium text-white/90"
                    }
                  >
                    {link.key === "home" && <HomeIcon />}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex items-center gap-3 border-t border-white/10 pt-3">
            <Link href={signInHref} className="px-4 text-sm font-medium text-white">
              Sign In
            </Link>
            <Link
              href={signUpHref}
              className="rounded-full border border-white/70 px-5 py-2 text-sm font-medium text-white"
            >
              Sign up Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
