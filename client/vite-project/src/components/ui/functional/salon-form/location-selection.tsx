import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

// Load Leaflet CSS dynamically
const loadLeafletCSS = () => {
  if (!document.getElementById("leaflet-css")) {
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
  }
};

const LocationSelection = ({
  selectedLocationObject,
  setSelectedLocationObject,
  hideMap = false,
}: {
  selectedLocationObject: any;
  setSelectedLocationObject: any;
  hideMap?: boolean;
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize map with CDN Leaflet
  useEffect(() => {
    if (!hideMap && mapRef.current && !mapInstanceRef.current) {
      loadLeafletCSS();

      const initializeMap = () => {
        const L = (window as any).L;
        if (!L || !mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current).setView([20, 78], 5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        setMapLoaded(true);
        map.on("click", (e: any) => handleMapClick(e.latlng.lat, e.latlng.lng));

        requestAnimationFrame(() => map.invalidateSize());
        window.setTimeout(() => map.invalidateSize(), 250);
        if (selectedLocationObject?.lat) {
          map.setView([selectedLocationObject.lat, selectedLocationObject.lon], 15);
        }
      };

      if ((window as any).L) {
        initializeMap();
        return;
      }

      const existingScript = document.querySelector<HTMLScriptElement>("script[data-leaflet]");
      if (existingScript) {
        existingScript.addEventListener("load", initializeMap, { once: true });
        return () => existingScript.removeEventListener("load", initializeMap);
      }

      const script = document.createElement("script");
      script.dataset.leaflet = "true";
      script.src = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initializeMap;
      document.body.appendChild(script);
    }
  }, [hideMap]);

  const handleMapClick = (lat: number, lng: number) => {
    setMapMarker(lat, lng);
    fetchLocationDetails(lat, lng);
  };

  const setMapMarker = (lat: number, lng: number) => {
    if (mapInstanceRef.current && mapLoaded) {
      const L = (window as any).L;
      if (L) {
        // Remove old marker
        if (markerRef.current) {
          mapInstanceRef.current.removeLayer(markerRef.current);
        }

        // Add new marker
        const marker = L.marker([lat, lng]).addTo(mapInstanceRef.current);
        markerRef.current = marker;

        // Center map on marker
        mapInstanceRef.current.setView([lat, lng], 15);
      }
    }
  };

  const fetchLocationDetails = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      setSelectedLocationObject({
        lat,
        lon: lng,
        display_name: data.address?.name || `${lat}, ${lng}`,
        ...data,
      });
      setQuery(data.address?.name || `${lat}, ${lng}`);
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  useEffect(() => {
    if (query.length > 2) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSelectLocation = (location: any) => {
    setSelectedLocationObject(location);
    setQuery(location.display_name);
    setSuggestions([]);
    
    // Update map if available
    if (location.lat && location.lon) {
      setMapMarker(Number.parseFloat(location.lat), Number.parseFloat(location.lon));
    }
  };

  useEffect(() => {
    if (selectedLocationObject?.display_name) {
      setQuery(selectedLocationObject.display_name);
    }
  }, [selectedLocationObject]);

  return (
    <div className="relative w-full space-y-4">
      <div className="relative">
        <label htmlFor="salon-location-search" className="mb-2 block text-sm font-medium text-gray-700">
          Search Location
        </label>
        <Input
          id="salon-location-search"
          type="text"
          placeholder="Search for a location or click on the map"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-60 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-900/15">
            {suggestions.map((place: any) => (
              <button
                type="button"
                key={place.place_id}
                onClick={() => handleSelectLocation(place)}
                className="block w-full cursor-pointer rounded-lg border-b border-slate-100 px-3 py-2.5 text-left text-sm leading-5 text-slate-700 transition-colors last:border-b-0 hover:bg-slate-100 hover:text-slate-950"
              >
                {place.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {!hideMap && (
        <div>
          <p className="mb-2 block text-sm font-medium text-gray-700">
            Select on Map
          </p>
          <div
            ref={mapRef}
            className="h-80 w-full overflow-hidden rounded-xl border border-slate-300 shadow-lg shadow-slate-900/10"
          />
          <p className="text-xs text-gray-500 mt-2">
            Click on the map to select a location
          </p>
          {query && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
              <strong>Selected Location:</strong> {query}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSelection;