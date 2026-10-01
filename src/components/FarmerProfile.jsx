"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  MapPin,
  IdCard,
  Loader2,
  ShieldCheck,
  Clock,
  Lock,
} from "lucide-react";

export function FarmerProfile() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    identification: "",
    registration_status: "approved",
  });

  // Load profile data from Supabase
  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Fetch from farmer_details or profiles
          const [{ data: farmerData }, { data: userProfile }] = await Promise.all([
            supabase
              .from("farmer_details")
              .select("name, phone, location, identification, registration_status")
              .eq("farmer_id", user.id)
              .maybeSingle(),
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", user.id)
              .maybeSingle(),
          ]);

          const meta = user.user_metadata || {};

          setProfileData({
            name:
              farmerData?.name ||
              userProfile?.full_name ||
              meta.full_name ||
              user.email?.split("@")[0] ||
              "Farmer",
            email: user.email || "",
            phone: farmerData?.phone || meta.phone || "—",
            location: farmerData?.location || meta.location || "—",
            identification: farmerData?.identification || meta.identification || "—",
            registration_status:
              farmerData?.registration_status || meta.registration_status || "approved",
          });
        } else {
          // Fallback preview state
          setProfileData({
            name: "Hameed Mahar",
            email: "farmer@example.com",
            phone: "+92 300 1234567",
            location: "Sukkur, Sindh",
            identification: "45201-1234567-1",
            registration_status: "approved",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <ShieldCheck className="size-3.5" />
            Approved Farmer
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="size-3.5" />
            Approval Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Top Header Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-xl">
              <User className="size-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                {profileData.name}
              </h1>
              <p className="text-xs text-muted-foreground">{profileData.email}</p>
            </div>
          </div>
          <div>{getStatusBadge(profileData.registration_status)}</div>
        </div>
      </Card>

      {/* Profile Details Card (Read-Only) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Registered Farmer Details</CardTitle>
              <CardDescription className="text-xs mt-1">
                Your verified personal and farm details registered with the procurement system.
              </CardDescription>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground">
              <Lock className="size-3" />
              Verified & Locked
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <User className="size-3.5 text-muted-foreground" />
              Farmer Full Name
            </Label>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {profileData.name}
            </p>
          </div>

          {/* Email Address */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <Mail className="size-3.5 text-muted-foreground" />
              Email Address
            </Label>
            <p className="mt-1 text-sm font-medium text-foreground">
              {profileData.email}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Phone Number */}
            <div className="rounded-lg border bg-muted/30 p-3">
              <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <Phone className="size-3.5 text-muted-foreground" />
                Phone Number
              </Label>
              <p className="mt-1 text-sm font-medium text-foreground">
                {profileData.phone}
              </p>
            </div>

            {/* National ID / Identification */}
            <div className="rounded-lg border bg-muted/30 p-3">
              <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
                <IdCard className="size-3.5 text-muted-foreground" />
                National ID / CNIC
              </Label>
              <p className="mt-1 text-sm font-medium text-foreground font-mono">
                {profileData.identification}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <Label className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3.5 text-muted-foreground" />
              Registered Farm / Tehsil Location
            </Label>
            <p className="mt-1 text-sm font-medium text-foreground">
              {profileData.location}
            </p>
          </div>

          {/* Verification info note */}
          <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
            <p>
              To maintain procurement queue integrity and prevent duplicate slot bookings, registered farmer profiles are locked. If you need to update your contact or location details, please contact your local procurement center administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FarmerProfile;
