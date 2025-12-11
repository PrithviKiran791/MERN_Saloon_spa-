import InfoMessage from "@/components/ui/info-message";
import PageTitle from "@/components/ui/page-title";
import Spinner from "@/components/ui/spinner";
import { backendUrl, salonsFilterOptions } from "@/constants";
import type { ISalon } from "@/interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateDistanceBetweenTwoLocation } from "@/utils";
import { MapPin, DollarSign, ArrowRight } from "lucide-react";
axios.defaults.withCredentials = true;
function UserSalonsPage() {
  const [allSalons, setAllSalons] = useState<ISalon[]>([]);
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>("all");
  const currentLocation: any = null; // User's current location for nearby filter
  const navigate = useNavigate();

  const fetchSalons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/salons/get-all-salons`);
      if (response.data.success) {
        setSalons(response.data.data);
        setAllSalons(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch salons");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch salons");
    } finally {
      setLoading(false);
    }
  };

  const onFilterChange = (type: string) => {
    try {
      let filterdedData = [...allSalons];
      if (type === "offers") {
        filterdedData = filterdedData.filter(
          (salon) => salon.offerStatus === "active"
        );
      }

      if (type === "premium") {
        filterdedData = filterdedData.sort((a, b) => {
          return b.minimumServicePrice - a.minimumServicePrice;
        });
      }

      if (type === "nearby") {
        filterdedData = filterdedData.sort((a, b) => {
          return (
            calculateDistanceBetweenTwoLocation({
              location1: a.locationInMap,
              location2: currentLocation,
            }) -
            calculateDistanceBetweenTwoLocation({
              location1: b.locationInMap,
              location2: currentLocation,
            })
          );
        });
      }

      setSalons(filterdedData);
    } catch (error: any) {
      toast.error(error?.message || "Failed to filter salons");
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-end">
        <PageTitle title="Available Salons" />

        <div>
          <h1 className="text-sm text-primary">Filter</h1>
          <Select
            onValueChange={(e) => {
              if (e === "nearby" && !currentLocation) {
                toast.error("Please select a location first.");
                setFilterType("all");
                return;
              }
              setFilterType(e);
              onFilterChange(e);
            }}
            defaultValue={filterType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>

            <SelectContent>
              {salonsFilterOptions.map((type: any) => (
                <SelectItem value={type.value} key={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading && <Spinner />}

      {!loading && salons.length === 0 && (
        <InfoMessage message="No salons available at the moment." />
      )}

      {!loading && salons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {salons.map((salon) => (
            <div
              key={salon._id}
              onClick={() =>
                navigate(`/user/salons/book-appointment/${salon._id}`)
              }
              className="group flex flex-col gap-3 border border-gray-200 bg-white rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-gray-400 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h2 className="text-base font-bold text-black group-hover:text-black/80 transition-colors line-clamp-2">
                    {salon.name}
                  </h2>
                  <div className="flex items-start gap-1 mt-2">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {salon.address}, {salon.city}, {salon.state}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-black group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-semibold text-black">
                  {salon.minimumServicePrice}
                </span>
                <span className="text-xs text-gray-500">
                  - ${salon.maximumServicePrice}
                </span>
              </div>

              {filterType === "nearby" && currentLocation && (
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <MapPin className="w-3 h-3" />
                  {calculateDistanceBetweenTwoLocation({
                    location1: salon.locationInMap,
                    location2: currentLocation,
                  }) || 0}{" "}
                  km away
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserSalonsPage;