export const ACTIVE_STATUSES = ["booked", "checked_in", "weighing", "quality_check", "payment"];
export const DONE_STATUSES = ["completed", "cancelled", "no_show"];

export const statusLabel = (s) => s.replaceAll("_", " ");

export const STATUS_STYLES = {
  booked: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  checked_in: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900",
  weighing: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  quality_check: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-900",
  payment: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900",
  completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
  no_show: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
};