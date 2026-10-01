'use client';

import { createClient } from '@/utils/supabase/client';
import { Loader2Icon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Landingpage - hero section only (no navbar, logo, or sign in / sign up).
 * Self-contained, lives entirely in components/.
 *
 * Usage (from any component, never edit page.js / layout.js):
 *   import Landingpage from "@/components/Landingpage";
 *   <Landingpage />
 *
 * Props (all optional):
 *   image     - hero image src (e.g. an imported file from ./assets). Shows a placeholder when omitted.
 *   ctaHref   - destination of the "Get Started" button
 *   trackHref - destination of the bottom-right link
 */

function Sparkle({ className = '', size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='currentColor'
      className={`absolute text-[#1d282a] ${className}`}
      aria-hidden='true'
    >
      <path d='M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z' />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M5 12h14M13 6l6 6-6 6' />
    </svg>
  );
}

export default function Landingpage({
  image,
  ctaHref = '/register',
  trackHref = '/track',
}) {

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

   const dashboardHref =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "farmer"
      ? "/farmer"
      : "/dashboard";


      if (loading) return (
        <div className='w-screen h-screen flex justify-center items-center overflow-hidden bg-white'>
        <Loader2Icon className="animate-spin" aria-hidden="true" />
        </div>
      )

  return (
    <section className='relative w-full overflow-hidden bg-[#f1f2f4] font-[Manrope,ui-sans-serif,system-ui,sans-serif]'>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      {/* Hero text */}
      <div className='relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-16 text-center sm:pt-20 md:pt-24'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 text-[11px] font-semibold text-[#1d282a]'>
          <span className='h-1.5 w-1.5 rounded-full bg-[#2f9e5b]' />
          Smart Procurement Queue Platform
        </div>

        {/* Headline */}
        <h1 className='mt-5 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-[#1d282a] sm:text-[56px] md:text-[68px]'>
          Bring Fresh Growth
          <br />
          To Agriculture.
        </h1>

        {/* Subline */}
        <p className='mx-auto mt-5 max-w-md text-[13px] leading-5 text-[#5b6264]'>
          Book a procurement slot before you arrive, get a digital token, and
          track your turn live, with no more waiting in long queues.
        </p>

        {/* CTA */}
         {!loading && (
          <Link
            href={user ? dashboardHref : ctaHref}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[13px] font-semibold text-white shadow-[0_12px_28px_rgba(29,40,42,0.38)] transition-transform hover:-translate-y-0.5"
          >
            {user ? "Dashboard" : "Get Started"}
            <ArrowRight />
          </Link>
        )}
      </div>

      {/* Hero image */}
      <div className='relative z-0 -mt-12 h-[380px] w-full sm:h-[460px] md:h-[560px]'>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={'/main.jpg'}
            alt='Farmland'
            className='absolute inset-0 h-full w-full object-cover'
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#9db3a0] via-[#5f9a4a] to-[#2f6a2c]'>
            <div className='flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-white/60 px-8 py-6 text-center text-white/90'>
              <svg
                width='36'
                height='36'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
                aria-hidden='true'
              >
                <rect x='3' y='4' width='18' height='16' rx='2' />
                <circle cx='9' cy='10' r='1.6' />
                <path d='m21 16-5-5-8 8' />
              </svg>
              <span className='text-sm font-semibold'>
                Hero image placeholder
              </span>
              <span className='text-xs text-white/75'>
                Pass your image with the <code>image</code> prop
              </span>
            </div>
          </div>
        )}

        {/* Mist fade from the page background into the image */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 top-0 h-3/5 bg-gradient-to-b from-[#f1f2f4] via-[#f1f2f4]/70 to-transparent'
        />

        {/* Bottom shade so the white text stays readable */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent'
        />

        {/* Bottom overlay text */}
        <div className='absolute inset-x-0 bottom-0 mx-auto flex max-w-6xl items-end justify-between gap-6 px-6 pb-6 sm:pb-8'>
          <h2 className='max-w-[260px] text-2xl font-semibold leading-tight tracking-tight text-white drop-shadow sm:text-[32px]'>
            Book Your Slot, Skip the Wait.
          </h2>
          <Link
            href={trackHref}
            className='text-[13px] font-medium text-white drop-shadow hover:underline'
          >
            Track My Token
          </Link>
        </div>
      </div>
    </section>
  );
}
