"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

const VALID_STATUSES = ["pending", "approved", "rejected"];

export async function updateFarmerStatus(id, status) {
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Invalid registration status." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  // The DB function checks the caller is admin or center_staff
  const { error } = await supabase.rpc("set_farmer_registration", {
    target_farmer: id,
    new_status: status,
  });

  if (error) {
    console.error("Farmer update error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/farmers");
  return { success: true };
}


const VALID_ROLES = ["farmer", "center_staff", "quality_inspector", "admin"];
const CENTER_ROLES = ["center_staff", "quality_inspector"];

export async function updateUserRole(id, role, centerId) {
  if (!VALID_ROLES.includes(role)) {
    return { success: false, error: "Invalid role." };
  }

  const needsCenter = CENTER_ROLES.includes(role);
  if (needsCenter && !centerId) {
    return { success: false, error: "Select a center for this role." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  if (user.id === id) {
    return { success: false, error: "You can't change your own role." };
  }

  // The DB function checks the caller is an admin
  const { error } = await supabase.rpc("admin_set_user_role", {
    target_user: id,
    new_role: role,
    new_center: needsCenter ? centerId : null,
  });

  if (error) {
    console.error("Role update error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/farmers");
  return { success: true };
}