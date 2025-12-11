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
      
      // Load Leaflet from CDN
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        // Access the global L object
        const L = (window as any).L;
        if (L && mapRef.current) {
          const map = L.map(mapRef.current).setView([20, 78], 5);
          
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }).addTo(map);

          mapInstanceRef.current = map;
          setMapLoaded(true);

          // Add click listener
          map.on("click", (e: any) => {
            const { lat, lng } = e.latlng;
            handleMapClick(lat, lng);
          });

          // Set initial marker if location exists
          if (selectedLocationObject && selectedLocationObject.lat) {
            setMapMarker(selectedLocationObject.lat, selectedLocationObject.lon);
          }
        }
      };
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
      setMapMarker(parseFloat(location.lat), parseFloat(location.lon));
    }
  };

  useEffect(() => {
    if (selectedLocationObject && selectedLocationObject.display_name) {
      setQuery(selectedLocationObject.display_name);
    }
  }, [selectedLocationObject]);

  return (
    <div className="relative w-full space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Search Location
        </label>
        <Input
          type="text"
          placeholder="Search for a location or click on the map"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        {suggestions.length > 0 && (
          <div className="absolute top-16 left-0 right-0 bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
            {suggestions.map((place: any) => (
              <div
                key={place.place_id}
                onClick={() => handleSelectLocation(place)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 text-sm"
              >
                {place.display_name}
              </div>
            ))}
          </div>
        )}
      </div>

      {!hideMap && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Select on Map
          </label>
          <div
            ref={mapRef}
            className="w-full rounded-lg border border-gray-300 shadow-sm"
            style={{ minHeight: "320px" }}
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