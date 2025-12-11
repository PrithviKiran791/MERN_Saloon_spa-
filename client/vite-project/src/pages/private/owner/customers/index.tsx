import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PageTitle from "@/components/ui/page-title";
import type { IBooking } from "@/interfaces";
import { backendUrl } from "@/constants";

export default function OwnerCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get("token");
        const res = await axios.get(`${backendUrl}/bookings/owner`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data?.success) {
          setBookings(res.data.data || []);
        } else {
          setError(res.data?.message || "Failed to load customers");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; email: string; visits: number; lastVisit?: string }>();
    bookings.forEach((b) => {
      if (typeof b.user === "string") return;
      const key = b.user?._id;
      if (!key) return;
      const existing = map.get(key) || { name: b.user.name, email: b.user.email, visits: 0, lastVisit: undefined };
      existing.visits += 1;
      existing.lastVisit = b.appointmentDate;
      map.set(key, existing);
    });
    return Array.from(map.values());
  }, [bookings]);

  return (
    <div className="space-y-4">
      <PageTitle title="Customers" />

      {loading && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-destructive/10 text-destructive border border-destructive/40 rounded-lg p-4">
          {error}
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground">No customers yet.</p>
        </div>
      )}

      {!loading && !error && customers.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="grid md:grid-cols-2 gap-3">
            {customers.map((c) => (
              <div key={c.email} className="border border-border/80 rounded-lg p-3 bg-muted/30">
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-muted-foreground">{c.email}</div>
                <div className="text-sm">Visits: {c.visits}</div>
                <div className="text-xs text-muted-foreground">Last visit: {c.lastVisit || "-"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
