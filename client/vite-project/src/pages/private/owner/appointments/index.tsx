import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import type { IBooking } from "@/interfaces";
import { backendUrl } from "@/constants";
import { Ripple } from "@/components/ui/ripple";

export default function OwnerAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
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
        setError(res.data?.message || "Failed to load appointments");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id: string, status: IBooking["status"]) => {
    try {
      setUpdatingId(id);
      const token = Cookies.get("token");
      await axios.put(
        `${backendUrl}/bookings/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchBookings();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="relative space-y-4">
      <Ripple 
        mainCircleSize={200}
        mainCircleOpacity={0.2}
        numCircles={6}
      />
      <div className="relative z-10">
      <PageTitle title="Salon Appointments" />

      {loading && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-destructive/10 text-destructive border border-destructive/40 rounded-lg p-4">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground">No appointments yet.</p>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="grid gap-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">{booking.appointmentDate}</div>
                <div className="text-lg font-semibold">
                  {booking.startTime} - {booking.endTime}
                </div>
                <div className="text-sm text-muted-foreground">
                  Salon: {typeof booking.salon === "string" ? booking.salon : booking.salon?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Customer: {typeof booking.user === "string" ? booking.user : booking.user?.name}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === "confirmed"
                      ? "bg-emerald-100 text-emerald-700"
                      : booking.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {booking.status}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updatingId === booking._id}
                  onClick={() => updateStatus(booking._id, "confirmed")}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={updatingId === booking._id}
                  onClick={() => updateStatus(booking._id, "cancelled")}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
