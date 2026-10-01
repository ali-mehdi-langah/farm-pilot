"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const GRADES = [
  { value: "A", label: "Grade A" },
  { value: "B", label: "Grade B" },
  { value: "C", label: "Grade C" },
  { value: "rejected", label: "Reject" },
];

export function InspectionForm({ bookingId, weight }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [isPending, startTransition] = useTransition();

  const [grade, setGrade] = useState(null);
  const [price, setPrice] = useState("");
  const [error, setError] = useState(null);

  const rejected = grade === "rejected";
  const total = !rejected && Number(price) > 0 ? Number(weight) * Number(price) : null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!grade) return setError("Pick a grade.");
    if (!rejected && !(Number(price) > 0)) return setError("Enter a price per kg.");

    setError(null);

    startTransition(async () => {
      const { error } = await supabase.rpc("record_inspection", {
        target_booking: bookingId,
        grade,
        price: rejected ? null : Number(price),
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/inspector/bookings");
      router.refresh();
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Quality grade</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {GRADES.map((g) => (
              <Button
                key={g.value}
                type="button"
                disabled={isPending}
                variant={
                  grade === g.value
                    ? g.value === "rejected"
                      ? "destructive"
                      : "default"
                    : "outline"
                }
                onClick={() => setGrade(g.value)}
              >
                {g.label}
              </Button>
            ))}
          </div>

          {rejected ? (
            <p className="text-sm text-muted-foreground">
              The produce will be rejected. The booking closes with no payment.
            </p>
          ) : (
            <div className="grid gap-1.5">
              <Label htmlFor="price">Price per kg (Rs)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 85"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isPending || !grade}
              />
            </div>
          )}

          {total !== null && (
            <div className="rounded-lg border bg-muted/40 p-3 text-sm">
              <span className="text-muted-foreground">
                {Number(weight).toLocaleString("en-US")} kg &times; Rs {Number(price).toLocaleString("en-PK")} ={" "}
              </span>
              <span className="text-base font-semibold">
                Rs {total.toLocaleString("en-PK", { maximumFractionDigits: 2 })}
              </span>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>

        <CardFooter className="mt-4">
          <Button
            type="submit"
            className="w-full"
            variant={rejected ? "destructive" : "default"}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : rejected ? (
              "Reject produce"
            ) : (
              "Save grade and send to payment"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}