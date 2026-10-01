"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CreateCenterForm({ onCreated }) {
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setError(null);
    setSuccess(null);

    const dailyCapacity = Number(fd.get("daily_capacity"));

    startTransition(async () => {
      const { data, error } = await supabase
        .from("procurement_centers")
        .insert({
          center_name: fd.get("center_name").trim(),
          location: fd.get("location").trim(),
          daily_capacity: dailyCapacity,
          available_capacity: dailyCapacity, // starts fully available
          weighing_stations: Number(fd.get("weighing_stations")),
          unloading_points: Number(fd.get("unloading_points")),
        })
        .select("center_id, center_name")
        .single();

      if (error) {
        setError(
          error.code === "42501"
            ? "Only administrators can create centers."
            : error.message
        );
        return;
      }

      form.reset();
      setSuccess(`"${data.center_name}" created.`);
      onCreated?.(data);
      router.refresh(); // reload server data (center lists, dropdowns)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create procurement center</CardTitle>
        <CardDescription>
          Add a new center where farmers can book slots.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="center_name">Center name</Label>
            <Input
              id="center_name"
              name="center_name"
              placeholder="e.g. Hyderabad Center 1"
              required
              disabled={isPending}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="City / area"
              required
              disabled={isPending}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="daily_capacity">Daily capacity (kg)</Label>
            <Input
              id="daily_capacity"
              name="daily_capacity"
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 50000"
              required
              disabled={isPending}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="weighing_stations">Weighing stations</Label>
              <Input
                id="weighing_stations"
                name="weighing_stations"
                type="number"
                min="0"
                step="1"
                defaultValue={1}
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="unloading_points">Unloading points</Label>
              <Input
                id="unloading_points"
                name="unloading_points"
                type="number"
                min="0"
                step="1"
                defaultValue={1}
                required
                disabled={isPending}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </CardContent>

        <CardFooter className="mt-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Create center"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}