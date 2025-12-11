import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import type { IBooking } from "@/interfaces";
import { backendUrl } from "@/constants";
import dayjs from "dayjs";
import { Calendar, Clock, Building2, CheckCircle, Clock3, XCircle } from "lucide-react";
import { Ripple } from "@/components/ui/ripple";

export default function UserAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get("token");
        const res = await axios.get(`${backendUrl}/bookings/mine`, {
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
    fetchBookings();
  }, []);

  return (
    <div className="relative space-y-4">
      <Ripple 
        mainCircleSize={200}
        mainCircleOpacity={0.2}
        numCircles={6}
      />
      <div className="relative z-10">
      <PageTitle title="My Appointments" />

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
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No appointments yet. Book a salon visit to see it here.</p>
          <Button className="bg-black text-white hover:bg-black/80" asChild>
            <a href="/user/salons">Browse Salons</a>
          </Button>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const statusConfig = {
              confirmed: {
                icon: CheckCircle,
                bg: "bg-green-50",
                border: "border-green-200",
                text: "text-green-700",
                badge: "bg-green-100 text-green-800",
              },
              pending: {
                icon: Clock3,
                bg: "bg-amber-50",
                border: "border-amber-200",
                text: "text-amber-700",
                badge: "bg-amber-100 text-amber-800",
              },
              cancelled: {
                icon: XCircle,
                bg: "bg-red-50",
                border: "border-red-200",
                text: "text-red-700",
                badge: "bg-red-100 text-red-800",
              },
            };

            const config = statusConfig[booking.status] || statusConfig.pending;
            const StatusIcon = config.icon;

            return (
              <div
                key={booking._id}
                className={`${config.bg} ${config.border} border rounded-lg p-6 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <StatusIcon className={`w-5 h-5 ${config.text}`} />
                      <h3 className="text-lg font-bold text-black">
                        {typeof booking.salon === "string"
                          ? booking.salon
                          : booking.salon?.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">
                          {dayjs(booking.appointmentDate).format("DD MMM YYYY")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 font-medium">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      {booking.salon && typeof booking.salon !== "string" && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700 font-medium">
                            {booking.salon.city}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`${config.badge} px-3 py-1 rounded-full text-xs font-semibold capitalize`}
                    >
                      {booking.status}
                    </span>
                    {booking.status !== "cancelled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-700 hover:bg-white/50"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
