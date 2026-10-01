"use client";

import React, { useState, useEffect, useMemo, useTransition, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Wheat,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Printer,
  MoreHorizontal,
  Scale,
  CircleDollarSign,
  Plus,
  Loader2,
  CalendarDays,
  Truck,
  ClipboardCheck,
  CheckCheck,
  X,
  Building2,
  Info,
} from "lucide-react";

// Digital Queue System Workflow stages as defined in Project Docs
const WORKFLOW_STAGES = [
  { id: "Booked", label: "Booked", icon: CalendarDays },
  { id: "Checked In", label: "Checked In", icon: Building2 },
  { id: "Waiting", label: "In Queue", icon: Clock3 },
  { id: "Weighing", label: "Weighing", icon: Scale },
  { id: "Quality Check", label: "Quality Check", icon: ClipboardCheck },
  { id: "Unloading", label: "Unloading", icon: Truck },
  { id: "Payment Pending", label: "Payment Pending", icon: CircleDollarSign },
  { id: "Completed", label: "Completed", icon: CheckCheck },
];

const CROPS = ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Potato", "Onion", "Tomato"];

// Realistic fallback/demo data adhering to Project Docs specifications
const SAMPLE_BOOKINGS = [
  {
    booking_id: "bk-1001",
    token_number: 1042,
    crop_type: "Wheat",
    estimated_quantity: 3000,
    booking_date: "2026-10-02",
    time_slot: "09:00-10:00",
    queue_status: "Checked In",
    center_id: "c-1",
    procurement_centers: {
      center_name: "Central Grain Mandi",
      location: "Sector 4, Main Highway",
    },
    procurements: null,
    created_at: "2026-10-01T08:30:00Z",
  },
  {
    booking_id: "bk-1002",
    token_number: 1043,
    crop_type: "Rice",
    estimated_quantity: 2500,
    booking_date: "2026-10-02",
    time_slot: "11:00-12:00",
    queue_status: "Booked",
    center_id: "c-2",
    procurement_centers: {
      center_name: "North Valley Agro Center",
      location: "Agro Complex, Gate 2",
    },
    procurements: null,
    created_at: "2026-10-01T09:15:00Z",
  },
  {
    booking_id: "bk-1003",
    token_number: 984,
    crop_type: "Wheat",
    estimated_quantity: 5000,
    booking_date: "2026-09-28",
    time_slot: "10:00-11:00",
    queue_status: "Completed",
    center_id: "c-1",
    procurement_centers: {
      center_name: "Central Grain Mandi",
      location: "Sector 4, Main Highway",
    },
    procurements: {
      procurement_id: "proc-984",
      actual_weight: 4950,
      quality_grade: "Grade A",
      price_per_unit: 26.5,
      total_amount: 131175,
      payment_status: "Paid",
      completion_time: "2026-09-28T12:45:00Z",
    },
    created_at: "2026-09-26T14:20:00Z",
  },
  {
    booking_id: "bk-1004",
    token_number: 991,
    crop_type: "Cotton",
    estimated_quantity: 1800,
    booking_date: "2026-09-30",
    time_slot: "14:00-15:00",
    queue_status: "Weighing",
    center_id: "c-3",
    procurement_centers: {
      center_name: "Southern Mill Silo",
      location: "Industrial Corridor, Yard 5",
    },
    procurements: {
      actual_weight: 1820,
      quality_grade: "Grade B",
      price_per_unit: 68.0,
      total_amount: 123760,
      payment_status: "Processing",
    },
    created_at: "2026-09-29T11:00:00Z",
  },
  {
    booking_id: "bk-1005",
    token_number: 955,
    crop_type: "Maize",
    estimated_quantity: 1200,
    booking_date: "2026-09-25",
    time_slot: "08:00-09:00",
    queue_status: "Cancelled",
    center_id: "c-2",
    procurement_centers: {
      center_name: "North Valley Agro Center",
      location: "Agro Complex, Gate 2",
    },
    procurements: null,
    created_at: "2026-09-24T16:00:00Z",
  },
];

// Status badge styling helper
const getStatusBadge = (status) => {
  const norm = (status || "").toLowerCase().trim();
  switch (norm) {
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
          <CheckCircle2 className="size-3.5" />
          Completed
        </span>
      );
    case "booked":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
          <CalendarDays className="size-3.5" />
          Booked
        </span>
      );
    case "checked in":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300">
          <Building2 className="size-3.5" />
          Checked In
        </span>
      );
    case "waiting":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
          <Clock3 className="size-3.5" />
          Waiting
        </span>
      );
    case "weighing":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
          <Scale className="size-3.5" />
          Weighing
        </span>
      );
    case "quality check":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300">
          <ClipboardCheck className="size-3.5" />
          Quality Check
        </span>
      );
    case "unloading":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
          <Truck className="size-3.5" />
          Unloading
        </span>
      );
    case "payment pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
          <CircleDollarSign className="size-3.5" />
          Payment Pending
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
          <XCircle className="size-3.5" />
          Cancelled
        </span>
      );
    case "rejected":
    case "missed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-950/60 dark:text-red-300">
          <AlertTriangle className="size-3.5" />
          {status}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-300">
          {status || "Unknown"}
        </span>
      );
  }
};

export function MyBookingsTable({ initialBookings = null }) {
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  // State
  const [bookings, setBookings] = useState(initialBookings || []);
  const [isLoading, setIsLoading] = useState(!initialBookings);
  const [error, setError] = useState(null);
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all"); // all, today, upcoming, past
  const [sortField, setSortField] = useState("booking_date");
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modals
  const [selectedBookingForPass, setSelectedBookingForPass] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  // Fetch bookings from Supabase
  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch current logged-in farmer
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        // If not authenticated or in preview mode, gracefully fallback to rich sample data
        setBookings(SAMPLE_BOOKINGS);
        setIsUsingDemoData(true);
        setIsLoading(false);
        return;
      }

      // 2. Fetch farmer bookings with related center & procurement records
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(`
          booking_id,
          token_number,
          crop_type,
          estimated_quantity,
          booking_date,
          time_slot,
          queue_status,
          center_id,
          created_at,
          procurement_centers (
            center_name,
            location
          ),
          procurements (
            procurement_id,
            actual_weight,
            quality_grade,
            price_per_unit,
            total_amount,
            payment_status,
            completion_time
          )
        `)
        .eq("farmer_id", user.id)
        .order("booking_date", { ascending: false });

      if (fetchError) {
        console.warn("Could not query supabase bookings:", fetchError.message);
        // Fallback to sample data for demo experience
        setBookings(SAMPLE_BOOKINGS);
        setIsUsingDemoData(true);
      } else if (!data || data.length === 0) {
        // Fallback to sample data if user has 0 bookings yet, but notify
        setBookings(SAMPLE_BOOKINGS);
        setIsUsingDemoData(true);
      } else {
        // Normalize joined structures
        const formatted = data.map((b) => ({
          ...b,
          procurement_centers: Array.isArray(b.procurement_centers)
            ? b.procurement_centers[0]
            : b.procurement_centers,
          procurements: Array.isArray(b.procurements)
            ? b.procurements[0]
            : b.procurements,
        }));
        setBookings(formatted);
        setIsUsingDemoData(false);
      }
    } catch (err) {
      console.error("Error loading bookings:", err);
      setBookings(SAMPLE_BOOKINGS);
      setIsUsingDemoData(true);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (!initialBookings) {
      loadBookings();
    }
  }, [initialBookings, loadBookings]);

  // Cancel Booking handler
  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;
    setIsCancelling(true);

    try {
      if (!isUsingDemoData) {
        const { error: updateError } = await supabase
          .from("bookings")
          .update({ queue_status: "Cancelled" })
          .eq("booking_id", bookingToCancel.booking_id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }

      // Optimistically update local list
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingToCancel.booking_id
            ? { ...b, queue_status: "Cancelled" }
            : b
        )
      );

      setActionNotice(`Booking #${bookingToCancel.token_number} has been cancelled successfully.`);
    } catch (err) {
      setActionNotice(`Failed to cancel booking: ${err.message}`);
    } finally {
      setIsCancelling(false);
      setBookingToCancel(null);
      setTimeout(() => setActionNotice(null), 5000);
    }
  };

  // Helper date calculations
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }, []);

  // Filter & Search Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesToken = String(item.token_number || "").includes(q);
        const matchesCrop = (item.crop_type || "").toLowerCase().includes(q);
        const matchesCenter = (item.procurement_centers?.center_name || "")
          .toLowerCase()
          .includes(q);
        const matchesLocation = (item.procurement_centers?.location || "")
          .toLowerCase()
          .includes(q);
        const matchesId = (item.booking_id || "").toLowerCase().includes(q);

        if (!matchesToken && !matchesCrop && !matchesCenter && !matchesLocation && !matchesId) {
          return false;
        }
      }

      // 2. Crop filter
      if (selectedCrop !== "all" && item.crop_type !== selectedCrop) {
        return false;
      }

      // 3. Status filter
      if (selectedStatus !== "all") {
        const currentStatus = (item.queue_status || "Booked").toLowerCase();
        if (selectedStatus === "active") {
          const activeStatuses = ["booked", "checked in", "waiting", "weighing", "quality check", "unloading"];
          if (!activeStatuses.includes(currentStatus)) return false;
        } else if (currentStatus !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      // 4. Date range filter
      if (dateRange !== "all") {
        const bDate = item.booking_date;
        if (dateRange === "today" && bDate !== todayStr) return false;
        if (dateRange === "upcoming" && bDate < todayStr) return false;
        if (dateRange === "past" && bDate >= todayStr) return false;
      }

      return true;
    });
  }, [bookings, searchQuery, selectedCrop, selectedStatus, dateRange, todayStr]);

  // Sorting Logic
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === "center_name") {
        valA = a.procurement_centers?.center_name || "";
        valB = b.procurement_centers?.center_name || "";
      } else if (sortField === "token_number" || sortField === "estimated_quantity") {
        valA = Number(valA || 0);
        valB = Number(valB || 0);
      } else {
        valA = String(valA || "");
        valB = String(valB || "");
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredBookings, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedBookings.length / pageSize) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedBookings.slice(start, start + pageSize);
  }, [sortedBookings, currentPage, pageSize]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Summary Metrics calculations
  const stats = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter((b) =>
      ["booked", "checked in", "waiting", "weighing", "quality check", "unloading"].includes(
        (b.queue_status || "").toLowerCase()
      )
    ).length;
    const completed = bookings.filter(
      (b) => (b.queue_status || "").toLowerCase() === "completed"
    ).length;
    const totalEstWeight = bookings.reduce(
      (acc, b) => acc + (Number(b.estimated_quantity) || 0),
      0
    );

    return { total, active, completed, totalEstWeight };
  }, [bookings]);

  // Find index of current status for progress bar
  const getWorkflowProgressIndex = (status) => {
    const s = (status || "").toLowerCase().trim();
    if (s === "cancelled" || s === "rejected" || s === "missed") return -1;
    const idx = WORKFLOW_STAGES.findIndex(
      (stage) => stage.label.toLowerCase() === s || stage.id.toLowerCase() === s
    );
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner Notice if any */}
      {actionNotice && (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-primary hover:opacity-75"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Demo / Preview Indicator */}
      {isUsingDemoData && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <Info className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <p>
            Showing preview/demo booking records for testing the digital queue table. Once you book slots via the booking form, your live database records will appear automatically.
          </p>
        </div>
      )}

      {/* Summary KPI Cards as specified in Project Docs Section 8 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total Bookings</p>
            <Ticket className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight">{stats.total}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">All scheduled records</p>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Active in Queue</p>
            <Clock3 className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {stats.active}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting or in process</p>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Completed</p>
            <CheckCheck className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {stats.completed}
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Delivered & finalized</p>
        </Card>

        <Card className="p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Est. Total Quantity</p>
            <Wheat className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight">
            {(stats.totalEstWeight / 1000).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">Tons</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{stats.totalEstWeight.toLocaleString()} kg allocated</p>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-xs overflow-hidden">
        <CardHeader className="border-b bg-card pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Ticket className="size-5 text-primary" />
                My Bookings & Queue Status
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Monitor your slot appointments, track live digital queue position, and access gate tokens.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadBookings}
                disabled={isLoading}
                title="Refresh table"
                className="gap-1.5 text-xs h-8"
              >
                <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                size="sm"
                render={<Link href="/farmer/bookings/new" />}
                className="gap-1.5 text-xs h-8"
              >
                <Plus className="size-3.5" />
                <span>New Booking</span>
              </Button>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-12">
            {/* Search Input */}
            <div className="relative sm:col-span-5">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search token, crop, or center..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 text-xs h-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active Queue</option>
                <option value="Booked">Booked</option>
                <option value="Checked In">Checked In</option>
                <option value="Waiting">Waiting</option>
                <option value="Weighing">Weighing</option>
                <option value="Quality Check">Quality Check</option>
                <option value="Unloading">Unloading</option>
                <option value="Payment Pending">Payment Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Crop Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedCrop}
                onChange={(e) => {
                  setSelectedCrop(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Crops</option>
                {CROPS.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div className="sm:col-span-2">
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                Loading your booking records...
              </p>
            </div>
          ) : paginatedBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="rounded-full bg-muted p-4">
                <Ticket className="size-8 text-muted-foreground" />
              </div>
              <p className="mt-3 font-semibold text-foreground">No bookings found</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                {searchQuery || selectedStatus !== "all" || selectedCrop !== "all" || dateRange !== "all"
                  ? "No bookings match your current search or filter criteria. Try resetting filters."
                  : "You haven't scheduled any crop deliveries yet. Book your first procurement slot to receive a digital token."}
              </p>
              {(searchQuery || selectedStatus !== "all" || selectedCrop !== "all" || dateRange !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("all");
                    setSelectedCrop("all");
                    setDateRange("all");
                  }}
                  className="mt-4 text-xs"
                >
                  Reset filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[110px]">
                      <button
                        onClick={() => toggleSort("token_number")}
                        className="flex items-center gap-1 font-semibold hover:text-primary transition-colors text-xs"
                      >
                        Token #
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>

                    <TableHead>
                      <button
                        onClick={() => toggleSort("crop_type")}
                        className="flex items-center gap-1 font-semibold hover:text-primary transition-colors text-xs"
                      >
                        Crop
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>

                    <TableHead>
                      <button
                        onClick={() => toggleSort("estimated_quantity")}
                        className="flex items-center gap-1 font-semibold hover:text-primary transition-colors text-xs"
                      >
                        Quantity
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>

                    <TableHead>
                      <button
                        onClick={() => toggleSort("center_name")}
                        className="flex items-center gap-1 font-semibold hover:text-primary transition-colors text-xs"
                      >
                        Procurement Center
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>

                    <TableHead>
                      <button
                        onClick={() => toggleSort("booking_date")}
                        className="flex items-center gap-1 font-semibold hover:text-primary transition-colors text-xs"
                      >
                        Date & Slot
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>

                    <TableHead>
                      <button
                        onClick={() => toggleSort("queue_status")}
                        className="flex items-center gap-1 font-semibold hover:text-primary transition-colors text-xs"
                      >
                        Queue Status
                        <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>

                    <TableHead className="hidden lg:table-cell text-xs font-semibold">
                      Procurement / Payout
                    </TableHead>

                    <TableHead className="text-right text-xs font-semibold pr-4">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedBookings.map((booking) => {
                    const centerName =
                      booking.procurement_centers?.center_name || "Procurement Center";
                    const centerLocation =
                      booking.procurement_centers?.location || "Main Center Yard";
                    const isUpcoming =
                      booking.booking_date >= todayStr &&
                      !["completed", "cancelled", "rejected"].includes(
                        (booking.queue_status || "").toLowerCase()
                      );
                    const canCancel = ["booked", "checked in"].includes(
                      (booking.queue_status || "").toLowerCase()
                    );
                    const procurement = booking.procurements;

                    return (
                      <TableRow key={booking.booking_id} className="hover:bg-muted/40 transition-colors">
                        {/* Token Number */}
                        <TableCell className="font-semibold py-3">
                          <button
                            onClick={() => setSelectedBookingForPass(booking)}
                            className="group flex items-center gap-1.5 text-left text-primary hover:underline"
                            title="Click to view digital token pass"
                          >
                            <span className="inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              #
                            </span>
                            <span className="text-sm font-bold tracking-tight">
                              {booking.token_number || "—"}
                            </span>
                          </button>
                        </TableCell>

                        {/* Crop */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                              <Wheat className="size-3.5" />
                            </div>
                            <span className="font-medium text-sm text-foreground">
                              {booking.crop_type}
                            </span>
                          </div>
                        </TableCell>

                        {/* Quantity */}
                        <TableCell className="py-3">
                          <div className="text-sm">
                            <span className="font-semibold text-foreground">
                              {Number(booking.estimated_quantity).toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">kg</span>
                            <span className="text-[11px] text-muted-foreground block">
                              ({(Number(booking.estimated_quantity) / 1000).toFixed(2)} tons)
                            </span>
                          </div>
                        </TableCell>

                        {/* Center */}
                        <TableCell className="py-3 max-w-[200px]">
                          <div className="truncate">
                            <p className="font-medium text-sm text-foreground truncate" title={centerName}>
                              {centerName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1" title={centerLocation}>
                              <MapPin className="size-3 shrink-0 text-muted-foreground" />
                              <span>{centerLocation}</span>
                            </p>
                          </div>
                        </TableCell>

                        {/* Date & Slot */}
                        <TableCell className="py-3">
                          <div className="space-y-0.5">
                            <p className="text-xs font-medium text-foreground flex items-center gap-1">
                              <Calendar className="size-3 text-muted-foreground" />
                              <span>{booking.booking_date}</span>
                              {booking.booking_date === todayStr && (
                                <span className="rounded bg-primary/10 px-1 py-0.2 text-[10px] font-bold text-primary">
                                  Today
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="size-3 text-muted-foreground" />
                              <span>{booking.time_slot}</span>
                            </p>
                          </div>
                        </TableCell>

                        {/* Queue Status */}
                        <TableCell className="py-3">
                          {getStatusBadge(booking.queue_status)}
                        </TableCell>

                        {/* Procurement / Payout info */}
                        <TableCell className="hidden lg:table-cell py-3">
                          {procurement ? (
                            <div className="text-xs space-y-0.5">
                              {procurement.quality_grade && (
                                <p className="font-medium text-foreground">
                                  Grade: <span className="font-bold text-emerald-600">{procurement.quality_grade}</span>
                                </p>
                              )}
                              {procurement.total_amount ? (
                                <p className="text-muted-foreground">
                                  Payout:{" "}
                                  <span className="font-semibold text-foreground">
                                    ₹{Number(procurement.total_amount).toLocaleString()}
                                  </span>
                                </p>
                              ) : (
                                <p className="text-muted-foreground">Processing weight</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right py-3 pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => setSelectedBookingForPass(booking)}
                              className="gap-1 text-xs h-7"
                              title="View Gate Token & QR Pass"
                            >
                              <Eye className="size-3" />
                              <span className="hidden sm:inline">Token Pass</span>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon-xs"
                                    className="h-7 w-7 p-0"
                                    title="More actions"
                                  />
                                }
                              >
                                <MoreHorizontal className="size-3.5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Booking #{booking.token_number}</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => setSelectedBookingForPass(booking)}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Ticket className="size-3.5" />
                                  <span>View Digital Pass</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedBookingForPass(booking);
                                    setTimeout(() => window.print(), 300);
                                  }}
                                  className="gap-2 cursor-pointer"
                                >
                                  <Printer className="size-3.5" />
                                  <span>Print Token Slip</span>
                                </DropdownMenuItem>

                                {canCancel && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => setBookingToCancel(booking)}
                                      className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                                    >
                                      <XCircle className="size-3.5" />
                                      <span>Cancel Booking</span>
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Table Footer with Pagination Controls */}
          <div className="flex flex-col gap-3 border-t bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground">
            <div>
              Showing{" "}
              <span className="font-medium text-foreground">
                {sortedBookings.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(currentPage * pageSize, sortedBookings.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{sortedBookings.length}</span>{" "}
              entries
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-7 rounded border border-input bg-background px-1.5 text-xs outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="h-7 w-7"
                  title="Previous page"
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="px-2 font-medium text-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon-xs"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="h-7 w-7"
                  title="Next page"
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================= */}
      {/* 1. DIGITAL TOKEN PASS & QUEUE TRACKER MODAL (DIALOG)     */}
      {/* ========================================================= */}
      <Dialog
        open={!!selectedBookingForPass}
        onOpenChange={(open) => !open && setSelectedBookingForPass(null)}
      >
        <DialogContent className="sm:max-w-md">
          {selectedBookingForPass && (
            <div>
              <DialogHeader className="text-center pb-2">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                  <Ticket className="size-6" />
                </div>
                <DialogTitle className="text-xl font-bold">
                  Digital Gate Pass & Token
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Present this digital token at the procurement center gate upon vehicle arrival.
                </DialogDescription>
              </DialogHeader>

              {/* Digital Pass Card */}
              <div className="mt-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Assigned Queue Token
                </p>
                <div className="my-2">
                  <span className="text-4xl font-extrabold tracking-tight text-primary">
                    #{selectedBookingForPass.token_number}
                  </span>
                </div>
                <div className="inline-block">
                  {getStatusBadge(selectedBookingForPass.queue_status)}
                </div>

                {/* Simulated QR Code for Gate Scanner */}
                <div className="mt-4 flex flex-col items-center justify-center">
                  <div className="rounded-lg bg-white p-2.5 shadow-xs border">
                    {/* Visual 2D Code Pattern */}
                    <div className="grid grid-cols-6 gap-1 size-24 bg-gray-900 p-1.5 rounded">
                      {Array.from({ length: 36 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-[1px] ${
                            (i * 7 + (selectedBookingForPass.token_number || 1)) % 3 === 0
                              ? "bg-white"
                              : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground font-mono">
                    AUTH-TOKEN: FP-{(selectedBookingForPass.token_number || 1000) * 83}
                  </p>
                </div>
              </div>

              {/* Appointment & Center Details */}
              <div className="mt-4 space-y-2 rounded-lg border bg-card p-3 text-xs">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Procurement Center:</span>
                  <span className="font-semibold text-right">
                    {selectedBookingForPass.procurement_centers?.center_name}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-right text-muted-foreground">
                    {selectedBookingForPass.procurement_centers?.location}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Crop & Estimated Qty:</span>
                  <span className="font-semibold text-right">
                    {selectedBookingForPass.crop_type} - {Number(selectedBookingForPass.estimated_quantity).toLocaleString()} kg
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Scheduled Slot:</span>
                  <span className="font-semibold text-right text-primary">
                    {selectedBookingForPass.booking_date} ({selectedBookingForPass.time_slot})
                  </span>
                </div>

                {/* Procurement Results if available */}
                {selectedBookingForPass.procurements && (
                  <>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-muted-foreground">Actual Net Weight:</span>
                      <span className="font-bold text-foreground">
                        {Number(selectedBookingForPass.procurements.actual_weight).toLocaleString()} kg
                      </span>
                    </div>
                    {selectedBookingForPass.procurements.quality_grade && (
                      <div className="flex justify-between border-b pb-1.5">
                        <span className="text-muted-foreground">Quality Inspection:</span>
                        <span className="font-bold text-emerald-600">
                          {selectedBookingForPass.procurements.quality_grade}
                        </span>
                      </div>
                    )}
                    {selectedBookingForPass.procurements.total_amount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Final Settlement:</span>
                        <span className="font-extrabold text-foreground">
                          ₹{Number(selectedBookingForPass.procurements.total_amount).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Live Queue Workflow Steps (Project Docs Section 3 & Section 10) */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-primary" />
                  Live Procurement Workflow Stage:
                </p>
                <div className="relative">
                  <div className="grid grid-cols-4 gap-1.5">
                    {WORKFLOW_STAGES.map((stage, idx) => {
                      const currentProgressIdx = getWorkflowProgressIndex(
                        selectedBookingForPass.queue_status
                      );
                      const isPast = idx < currentProgressIdx;
                      const isCurrent = idx === currentProgressIdx;

                      return (
                        <div
                          key={stage.id}
                          className={`flex flex-col items-center text-center p-1.5 rounded-md border text-[10px] transition-colors ${
                            isCurrent
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                              : isPast
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40"
                              : "border-border bg-muted/30 text-muted-foreground opacity-60"
                          }`}
                        >
                          <stage.icon className={`size-3 mb-1 ${isCurrent ? "text-primary animate-pulse" : ""}`} />
                          <span className="truncate w-full">{stage.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-5 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="flex-1 gap-1.5 text-xs"
                >
                  <Printer className="size-3.5" />
                  Print Pass
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSelectedBookingForPass(null)}
                  className="flex-1 text-xs"
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* 2. CANCEL BOOKING CONFIRMATION MODAL                      */}
      {/* ========================================================= */}
      <Dialog
        open={!!bookingToCancel}
        onOpenChange={(open) => !open && setBookingToCancel(null)}
      >
        <DialogContent className="sm:max-w-sm">
          {bookingToCancel && (
            <div>
              <DialogHeader>
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-2">
                  <AlertTriangle className="size-5" />
                </div>
                <DialogTitle className="text-center">Cancel Booking?</DialogTitle>
                <DialogDescription className="text-center text-xs">
                  Are you sure you want to cancel token{" "}
                  <strong className="text-foreground">#{bookingToCancel.token_number}</strong> for{" "}
                  {bookingToCancel.crop_type} on {bookingToCancel.booking_date}?
                  This slot will be released back to the procurement center.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBookingToCancel(null)}
                  disabled={isCancelling}
                  className="flex-1 text-xs"
                >
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelBooking}
                  disabled={isCancelling}
                  className="flex-1 text-xs"
                >
                  {isCancelling ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Yes, Cancel"
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MyBookingsTable;
