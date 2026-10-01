"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  updateFarmerStatus,
  updateUserRole,
} from "@/app/admin/farmers/actions";

const ROLES = [
  { value: "farmer", label: "Farmer" },
  { value: "center_staff", label: "Center staff" },
  { value: "quality_inspector", label: "Quality inspector" },
  { value: "admin", label: "Admin" },
];

const CENTER_ROLES = ["center_staff", "quality_inspector"];

const selectClass =
  "h-8 rounded-md border border-input bg-background px-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

function RoleEditor({ user, centers, isSelf }) {
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState(user.role);
  const [centerId, setCenterId] = useState(user.center_id ?? "");
  const [error, setError] = useState(null);

  const needsCenter = CENTER_ROLES.includes(role);
  const dirty =
    role !== user.role ||
    (needsCenter && centerId !== (user.center_id ?? ""));

  const save = () => {
    setError(null);
    startTransition(async () => {
      const result = await updateUserRole(user.id, role, centerId || null);
      if (!result.success) setError(result.error);
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className={selectClass}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isSelf || isPending}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        {needsCenter && (
          <select
            className={selectClass}
            value={centerId}
            onChange={(e) => setCenterId(e.target.value)}
            disabled={isPending}
          >
            <option value="">Select center</option>
            {centers.map((c) => (
              <option key={c.center_id} value={c.center_id}>
                {c.center_name}
              </option>
            ))}
          </select>
        )}

        {dirty && (
          <Button
            size="sm"
            onClick={save}
            disabled={isPending || (needsCenter && !centerId)}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Save"}
          </Button>
        )}
      </div>

      {isSelf && <p className="text-xs text-muted-foreground">This is you</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function FarmersTable({ users, centers, currentUserId }) {
  const [loadingId, setLoadingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");

  const handleStatusChange = async (id, status) => {
    setLoadingId(id);
    const result = await updateFarmerStatus(id, status);
    setLoadingId(null);

    if (!result.success) alert(result.error);
  };

  const visible =
    roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

  return (
    <div className="space-y-4">
      <select
        className={`${selectClass} h-9`}
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="all">All roles</option>
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((user) => {
                const isFarmer = user.role === "farmer";
                const status = user.farmers?.registration_status || "pending";

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.full_name || "Unnamed user"}
                    </TableCell>

                    <TableCell>{user.phone || "-"}</TableCell>

                    <TableCell>
                      <RoleEditor
                        user={user}
                        centers={centers}
                        isSelf={user.id === currentUserId}
                      />
                    </TableCell>

                    <TableCell>
                      {isFarmer ? (
                        <Badge
                          variant={
                            status === "approved"
                              ? "default"
                              : status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {status}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {isFarmer && status !== "approved" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(user.id, "approved")}
                            disabled={loadingId === user.id}
                          >
                            <Check className="mr-1 size-4" />
                            Accept
                          </Button>
                        )}

                        {isFarmer && status !== "rejected" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusChange(user.id, "rejected")}
                            disabled={loadingId === user.id}
                          >
                            <X className="mr-1 size-4" />
                            Reject
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}