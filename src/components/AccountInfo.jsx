import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function AccountInfo({ user, title, href, linkLabel }) {
  let center = user.role === "admin" ? "All centers" : "-";

  if (user.center_id) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("procurement_centers")
      .select("center_name, location")
      .eq("center_id", user.center_id)
      .single();

    if (data) center = `${data.center_name} - ${data.location}`;
  }

  const info = [
    ["Name", user.full_name || "-", ""],
    ["Email", user.email, ""],
    ["Role", user.role.replaceAll("_", " "), "capitalize"],
    ["Center", center, ""],
  ];

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Your account details.</CardDescription>
        </CardHeader>

        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {info.map(([label, value, extra]) => (
              <div key={label}>
                <dt className="text-muted-foreground">{label}</dt>
                <dd className={`font-medium ${extra}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Link
        href={href}
        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        {linkLabel}
      </Link>
    </div>
  );
}