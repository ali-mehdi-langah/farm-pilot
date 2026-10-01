"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarPlus,
  Ticket,
  User,
  Wheat,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";

export function FarmerDashboard({
  user = null,
  farmer = null,
  initialBookings = null,
}) {
  const farmerName =
    farmer?.name || user?.full_name || user?.email?.split("@")[0] || "Farmer";
  const registrationStatus = farmer?.registration_status || "approved";

  // Next upcoming booking (or fallback demo)
  const nextBooking = useMemo(() => {
    if (initialBookings && initialBookings.length > 0) {
      return initialBookings[0];
    }
    return {
      token_number: 1042,
      crop_type: "Wheat",
      estimated_quantity: 3000,
      booking_date: "2026-10-02",
      time_slot: "09:00 - 10:00",
      queue_status: "Booked",
      procurement_centers: {
        center_name: "Central Grain Mandi",
        location: "Sector 4, Main Highway",
      },
    };
  }, [initialBookings]);

  return (
    <div className="relative min-h-[calc(100vh-6.5rem)] -m-4 md:-m-6 p-4 sm:p-6 md:p-8 rounded-xl overflow-hidden flex flex-col justify-between">
      {/* ------------------------------------------------------------- */}
      {/* FULL VIBRANCY BACKGROUND IMAGE - NOT FADED OUT                */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/dashboard-bg.jpg')`,
        }}
        aria-hidden="true"
      />
      {/* Balanced contrast tint so white cards and header pop clearly */}
      <div
        className="absolute inset-0 bg-black/40 pointer-events-none"
        aria-hidden="true"
      />

      {/* ------------------------------------------------------------- */}
      {/* MAIN DASHBOARD CONTENT (SIMPLISTIC & EASY TO UNDERSTAND)      */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 max-w-5xl mx-auto w-full space-y-6">
        {/* Welcome Header */}
        <div className="rounded-2xl bg-white/95 dark:bg-zinc-900/95 p-6 sm:p-8 shadow-xl border border-white/20 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-2">
                <ShieldCheck className="size-4" />
                {registrationStatus === "approved" ? "Approved Farmer" : "Pending Verification"}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                Welcome, {farmerName}!
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Book your crop delivery slot, check your queue token, or view your profile below.
              </p>
            </div>

            <Button
              size="lg"
              render={<Link href="/farmer/bookings/new" />}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md text-sm gap-2 h-11 px-5 shrink-0"
            >
              <CalendarPlus className="size-5" />
              <span>Book New Slot</span>
            </Button>
          </div>
        </div>

        {/* 3 Large, Simple Action Cards Anyone Can Understand */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Book Slot */}
          <Link href="/farmer/bookings/new" className="group block">
            <Card className="h-full bg-white/95 dark:bg-zinc-900/95 border-2 border-transparent hover:border-primary shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="p-6">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 mb-3 group-hover:scale-110 transition-transform">
                  <CalendarPlus className="size-7" />
                </div>
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center justify-between">
                  Book Delivery Slot
                  <ArrowRight className="size-5 text-zinc-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Choose a date and time to bring your harvest to the Mandi.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Card 2: My Bookings & Token Pass */}
          <Link href="/farmer/bookings" className="group block">
            <Card className="h-full bg-white/95 dark:bg-zinc-900/95 border-2 border-transparent hover:border-amber-500 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="p-6">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 mb-3 group-hover:scale-110 transition-transform">
                  <Ticket className="size-7" />
                </div>
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center justify-between">
                  My Bookings & Pass
                  <ArrowRight className="size-5 text-zinc-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  View your token number, gate pass, and live queue status.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Card 3: Profile */}
          <Link href="/farmer/profile" className="group block">
            <Card className="h-full bg-white/95 dark:bg-zinc-900/95 border-2 border-transparent hover:border-blue-500 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader className="p-6">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-3 group-hover:scale-110 transition-transform">
                  <User className="size-7" />
                </div>
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center justify-between">
                  My Profile
                  <ArrowRight className="size-5 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  View your registered CNIC, contact phone, and farm location.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Your Next Delivery - Simple Overview Card */}
        {nextBooking && (
          <Card className="bg-white/95 dark:bg-zinc-900/95 shadow-xl border border-white/20">
            <CardHeader className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Wheat className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      Your Next Delivery
                    </CardTitle>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Present your token number upon arrival at the center.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-zinc-500">Token Number:</span>
                  <span className="rounded-lg bg-primary px-3 py-1 text-sm font-extrabold text-primary-foreground shadow-xs">
                    #{nextBooking.token_number}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs">
                {/* Crop & Quantity */}
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3.5 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                    Crop & Quantity
                  </span>
                  <span className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-50 block">
                    {nextBooking.crop_type}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    {Number(nextBooking.estimated_quantity).toLocaleString()} kg
                  </span>
                </div>

                {/* Date */}
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3.5 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                    Delivery Date
                  </span>
                  <span className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-50 block">
                    {nextBooking.booking_date}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                    {nextBooking.time_slot}
                  </span>
                </div>

                {/* Mandi Center */}
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3.5 border border-zinc-100 dark:border-zinc-800">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                    Procurement Mandi
                  </span>
                  <span className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-50 block truncate" title={nextBooking.procurement_centers?.center_name}>
                    {nextBooking.procurement_centers?.center_name || "Central Mandi"}
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400 text-[11px] truncate block" title={nextBooking.procurement_centers?.location}>
                    {nextBooking.procurement_centers?.location || "Main Highway"}
                  </span>
                </div>

                {/* Status */}
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-3.5 border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                    Queue Status
                  </span>
                  <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-bold text-blue-800 dark:text-blue-300 w-fit">
                    {nextBooking.queue_status}
                  </span>
                  <Link
                    href="/farmer/bookings"
                    className="text-[11px] font-bold text-primary hover:underline mt-1"
                  >
                    View pass &rarr;
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Simple Footer Help Note */}
      <div className="relative z-10 max-w-5xl mx-auto w-full mt-6">
        <div className="rounded-xl bg-black/40 text-white backdrop-blur-xs px-4 py-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>Center Gate Hours: 08:00 AM – 05:00 PM &bull; Arrive 15 mins before your time slot</span>
          </div>
          <Link href="/farmer/bookings" className="text-primary hover:underline font-semibold hidden sm:inline">
            All Bookings &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard;
