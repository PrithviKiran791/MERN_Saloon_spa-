import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import type { ISalon } from "@/interfaces";
import { backendUrl } from "@/constants";

export default function SalonDetailPage() {
  const { id } = useParams();
  const [salon, setSalon] = useState<ISalon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const slotDurationMinutes = salon?.slotDuration || 30;

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  const minutesToTime = (m: number) => {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const slots = useMemo(() => {
    if (!salon?.startTime || !salon?.endTime) return [];
    const start = timeToMinutes(salon.startTime);
    const end = timeToMinutes(salon.endTime);
    if (start === null || end === null || start >= end) return [];
    const breakStart = salon.breakStartTime ? timeToMinutes(salon.breakStartTime) : null;
    const breakEnd = salon.breakEndTime ? timeToMinutes(salon.breakEndTime) : null;
    const list: string[] = [];
    for (let t = start; t + slotDurationMinutes <= end; t += slotDurationMinutes) {
      const slotEnd = t + slotDurationMinutes;
      const overlapsBreak = breakStart !== null && breakEnd !== null && !(slotEnd <= breakStart || t >= breakEnd);
      if (!overlapsBreak) list.push(minutesToTime(t));
    }
    return list;
  }, [salon, slotDurationMinutes]);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get("token");
        const res = await axios.get(`${backendUrl}/api/salons/get-salon-by-id/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.data?.success) {
          setSalon(res.data.data);
        } else {
          setError(res.data?.message || "Failed to load salon");
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSalon();
  }, [id]);

  const workingDaysText = useMemo(() => {
    if (!salon?.workingDays?.length) return "Not specified";
    return salon.workingDays.join(", ");
  }, [salon]);

  const handleBook = async () => {
    if (!salon?._id || !selectedDate || !selectedSlot) {
      setBookingError("Select a date and time slot.");
      return;
    }
    try {
      setBookingLoading(true);
      setBookingError(null);
      setBookingSuccess(null);
      const token = Cookies.get("token");
      const endTime = minutesToTime((timeToMinutes(selectedSlot) || 0) + slotDurationMinutes);
      await axios.post(
        `${backendUrl}/bookings/create`,
        {
          salon: salon._id,
          appointmentDate: selectedDate,
          startTime: selectedSlot,
          endTime,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      setBookingSuccess("Appointment booked successfully.");
    } catch (err: any) {
      setBookingError(err?.response?.data?.message || err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageTitle title="Salon Details" />

      {loading && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground">Loading salon...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-destructive/10 text-destructive border border-destructive/40 rounded-lg p-4">
          {error}
        </div>
      )}

      {!loading && !error && salon && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{salon.name}</h2>
            <p className="text-muted-foreground">
              {salon.address}, {salon.city}, {salon.state} {salon.zipCode}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 border border-border rounded-lg bg-muted/30">
              <div className="text-sm text-muted-foreground">Price Range</div>
              <div className="font-semibold">
                ${salon.minimumServiceCharge} - ${salon.maximumServiceCharge}
              </div>
            </div>
            <div className="p-3 border border-border rounded-lg bg-muted/30">
              <div className="text-sm text-muted-foreground">Offer Status</div>
              <div className="font-semibold capitalize">{salon.offerStatus}</div>
            </div>
          </div>

          <div className="p-3 border border-border rounded-lg bg-muted/30">
            <div className="text-sm text-muted-foreground">Working Days</div>
            <div className="font-semibold">{workingDaysText}</div>
          </div>

          <div className="space-y-3">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Select Date</div>
                <input
                  type="date"
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Available Slots</div>
                <div className="flex flex-wrap gap-2">
                  {slots.length === 0 && <span className="text-muted-foreground text-sm">No slots available</span>}
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                        selectedSlot === slot
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {bookingError && (
              <div className="bg-destructive/10 text-destructive border border-destructive/40 rounded-lg p-3 text-sm">
                {bookingError}
              </div>
            )}
            {bookingSuccess && (
              <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg p-3 text-sm">
                {bookingSuccess}
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleBook} disabled={bookingLoading || !selectedSlot}>
                {bookingLoading ? "Booking..." : "Book appointment"}
              </Button>
              <Button variant="outline" asChild>
                <Link to="/home">Back to salons</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
