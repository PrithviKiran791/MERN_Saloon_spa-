import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl } from "@/constants";
import type { ISalon } from "@/interfaces";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DatePicker from "react-datepicker";
import isBetween from "dayjs/plugin/isBetween";
import Cookies from "js-cookie";

dayjs.extend(isBetween);

import "react-datepicker/dist/react-datepicker.css";
import { getTimeFormat } from "@/utils";
import { useUsersStore, type IUsersStore } from "@/store/users-store";

function BookAppointmentPage() {
  const [salonData, setSalonData] = useState<ISalon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [availableCount, setAvailableCount] = useState<number>(0);
  const [bookingAppointment, setBookingAppointment] = useState<boolean>(false);
  const { user } = useUsersStore() as IUsersStore;
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const getData = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await axios.get(
        `${backendUrl}/salons/get-salon-by-id/${params.id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      setSalonData(response.data.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch salon data"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      const token = Cookies.get("token");
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      const response = await axios.post(
        `${backendUrl}/bookings/check-availability`,
        {
          salonId: params.id,
          date: formattedDate,
          time,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setIsAvailable(response.data.success);
        setAvailableCount(response.data.data);
      } else {
        setIsAvailable(false);
        setAvailableCount(0);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to check availability"
      );
      setIsAvailable(false);
      setAvailableCount(0);
    }
  };

  const bookAppointment = async () => {
    try {
      setBookingAppointment(true);
      const token = Cookies.get("token");
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      
      // Calculate end time based on slot duration
      const endTimeHours = dayjs(formattedDate + " " + time, "YYYY-MM-DD HH:mm").add(
        salonData?.slotDuration || 30,
        "minutes"
      );
      const endTime = endTimeHours.format("HH:mm");

      const payload = {
        salon: salonData?._id,
        appointmentDate: formattedDate,
        startTime: time,
        endTime: endTime,
        notes: "",
      };
      
      console.log("Booking payload:", payload);
      console.log("Token:", token);
      
      const response = await axios.post(
        `${backendUrl}/bookings/create`,
        payload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      
      console.log("Booking response:", response.data);
      
      if (response.data.success) {
        toast.success("Appointment booked successfully");
        navigate("/user/appointments");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error("Booking error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    } finally {
      setBookingAppointment(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      getData();
    }
  }, []);

  const renderSalonProperty = (label: string, value: string | number) => (
    <div className="flex justify-between items-center py-2 px-1 border-b border-gray-100 last:border-b-0">
      <h3 className="text-sm font-medium text-gray-600">{label}</h3>
      <h3 className="text-sm font-semibold text-black">{value}</h3>
    </div>
  );

  const timeslots = useMemo(() => {
    const tempTimeslots: { label: string; value: string }[] = [];
    if (date && salonData) {
      let startTime = dayjs(
        `${date} ${salonData?.startTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const endTime = dayjs(
        `${date} ${salonData?.endTime}`,
        "YYYY-MM-DD HH:mm"
      );

      const breakStartTime = dayjs(
        `${date} ${salonData?.breakStartTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const breakEndTime = dayjs(
        `${date} ${salonData?.breakEndTime}`,
        "YYYY-MM-DD HH:mm"
      );

      while (startTime.isBefore(endTime)) {
        if (
          !startTime.isBetween(breakStartTime, breakEndTime, null, "[]") ||
          startTime.isSame(breakEndTime)
        ) {
          tempTimeslots.push({
            label: startTime.format("h:mm A"),
            value: startTime.format("HH:mm"),
          });
        }
        startTime = startTime.add(salonData!.slotDuration!, "minute");
      }
    }

    return tempTimeslots;
  }, [salonData, date]);

  useEffect(() => {
    if (date && time) {
      setIsAvailable(false);
      setAvailableCount(0);
      checkAvailability();
    }
  }, [date, time]);

  return (
    <div>
      <PageTitle title="Book Appointment" />

      {loading && <Spinner />}

      {!loading && !salonData && <InfoMessage message="Salon not found" />}

      {salonData && (
        <div className="grid grid-cols-3 gap-7 mt-6">
          <div className="col-span-2 flex flex-col gap-0 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-black mb-4 pb-3 border-b-2 border-black">
              {salonData.name}
            </h3>
            {renderSalonProperty("Address", salonData.address)}
            {renderSalonProperty("City", salonData.city)}
            {renderSalonProperty("State", salonData.state)}
            {renderSalonProperty("Zip Code", salonData.zipCode)}
            {renderSalonProperty(
              "Minimum Service Price",
              "$" + salonData.minimumServicePrice
            )}
            {renderSalonProperty(
              "Maximum Service Price",
              "$" + salonData.maximumServicePrice
            )}
            {renderSalonProperty(
              "Working Days",
              salonData.workingDays.join(", ").toUpperCase()
            )}
            {renderSalonProperty(
              "Slot Duration",
              salonData.slotDuration + " min"
            )}
            {renderSalonProperty(
              "Start Time",
              getTimeFormat(salonData.startTime)
            )}
            {renderSalonProperty("End Time", getTimeFormat(salonData.endTime))}
            {renderSalonProperty(
              "Break Start Time",
              getTimeFormat(salonData.breakStartTime)
            )}
            {renderSalonProperty(
              "Break End Time",
              getTimeFormat(salonData.breakEndTime)
            )}
          </div>
          <div className="col-span-1 flex flex-col gap-4 p-6 bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-lg shadow-sm h-max sticky top-8">
            <h3 className="text-lg font-bold text-black">Book Now</h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-black">Select date</label>
              <DatePicker
                selected={date}
                onChange={(selectedDate: Date | null) => {
                  console.log("Date selected:", selectedDate);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
                className="border border-gray-300 rounded-lg p-3 w-full cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                minDate={new Date()}
                filterDate={(date: any) => {
                  const day = dayjs(date).format("dddd").toLowerCase();
                  return salonData?.workingDays.includes(day);
                }}
                placeholderText="Click to select date"
                popperClassName="z-50 absolute"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-black">Select time</label>
              <Select
                onValueChange={(e) => {
                  setTime(e);
                }}
                defaultValue={time}
                disabled={!salonData || date === null}
              >
                <SelectTrigger className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-black disabled:opacity-50">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>

                <SelectContent>
                  {timeslots.map((slot) => (
                    <SelectItem value={slot.value} key={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isAvailable && (
              <div className="bg-green-50 border border-green-300 rounded-lg p-3">
                <p className="text-sm font-semibold text-green-700">
                  ✓ Slot Available
                </p>
              </div>
            )}

            {time && !isAvailable && (
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-3">
                <p className="text-sm font-semibold text-amber-700">
                  🔍 Checking availability...
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate("/user/salons")}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black font-medium hover:bg-gray-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                disabled={!time || !date || bookingAppointment}
                onClick={bookAppointment}
                className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-black/80 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {bookingAppointment ? "Booking..." : "Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointmentPage;