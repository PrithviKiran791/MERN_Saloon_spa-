import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTitle from "@/components/ui/page-title";
import type { ISalon } from "@/interfaces";
import { backendUrl } from "@/constants";

export default function SalonsFilterPage() {
  const [loading, setLoading] = useState(true);
  const [salons, setSalons] = useState<ISalon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    offerStatus: "" as "" | "active" | "inactive",
  });

  const fetchSalons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${backendUrl}/api/salons/get-all-salons`);
      if (res.data?.success) {
        let filtered = res.data.data || [];

        if (filters.city) {
          filtered = filtered.filter((s: ISalon) =>
            s.city.toLowerCase().includes(filters.city.toLowerCase())
          );
        }

        if (filters.minPrice) {
          const min = Number(filters.minPrice);
          filtered = filtered.filter((s: ISalon) => s.minimumServiceCharge >= min);
        }

        if (filters.maxPrice) {
          const max = Number(filters.maxPrice);
          filtered = filtered.filter((s: ISalon) => s.maximumServiceCharge <= max);
        }

        if (filters.offerStatus) {
          filtered = filtered.filter((s: ISalon) => s.offerStatus === filters.offerStatus);
        }

        setSalons(filtered);
      } else {
        setError(res.data?.message || "Failed to load salons");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    fetchSalons();
  };

  const handleReset = () => {
    setFilters({ city: "", minPrice: "", maxPrice: "", offerStatus: "" });
  };

  return (
    <div className="space-y-4">
      <PageTitle title="Browse Salons" />

      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <Input
            placeholder="Search by city..."
            value={filters.city}
            onChange={(e) => handleFilterChange("city", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
          <select
            className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={filters.offerStatus}
            onChange={(e) => handleFilterChange("offerStatus", e.target.value as any)}
          >
            <option value="">All Offers</option>
            <option value="active">Active Offers</option>
            <option value="inactive">No Offers</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      {loading && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground">Loading salons...</p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/40 rounded-lg p-4">
          {error}
        </div>
      )}

      {!loading && !error && salons.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground">No salons found matching your filters.</p>
        </div>
      )}

      {!loading && !error && salons.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {salons.map((salon) => (
            <a
              key={salon._id}
              href={`/salons/${salon._id}`}
              className="block bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-primary transition-all"
            >
              <div className="font-semibold text-lg">{salon.name}</div>
              <div className="text-sm text-muted-foreground">{salon.city}, {salon.state}</div>
              <div className="text-sm mt-2">
                ${salon.minimumServiceCharge} - ${salon.maximumServiceCharge}
              </div>
              <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${salon.offerStatus === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
                {salon.offerStatus}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
