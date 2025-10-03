'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Types for address data
interface AddressData {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  area?: string;
  displayName?: string;
}

interface MapPickerProps {
  initialAddress?: Partial<AddressData>;
  onAddressChange: (address: AddressData) => void;
  className?: string;
}

// Dynamically import Leaflet components to avoid SSR issues
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LoopIcon from '@mui/icons-material/Loop';
import SearchIcon from '@mui/icons-material/Search';

// Icon aliases
const MapPin = LocationOnIcon;
const Loader = LoopIcon;
const Search = SearchIcon;
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Component to handle map events - must be inside MapContainer
function MapEventHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  // This component must be used inside MapContainer to access the map context
  const MapEvents = () => {
    const map = (window as any).L ? require('react-leaflet').useMap() : null;

    useEffect(() => {
      if (!map) return;

      const handleClick = (e: any) => {
        onLocationChange(e.latlng.lat, e.latlng.lng);
      };

      map.on('click', handleClick);

      return () => {
        map.off('click', handleClick);
      };
    }, [map]);

    return null;
  };

  return <MapEvents />;
}

export default function MapPicker({ initialAddress, onAddressChange, className = '' }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number]>([25.2048, 55.2708]); // Default to Dubai
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [addressData, setAddressData] = useState<AddressData>({
    addressLine1: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
  });
  const markerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize with current location or initial address
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Import Leaflet CSS
    import('leaflet/dist/leaflet.css');

    // Fix default marker icon
    const L = require('leaflet');
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    setMapReady(true);

    // Try to get user's current location
    if (navigator.geolocation && !initialAddress?.latitude) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.log('Location access denied:', error);
          // Use initial address if provided
          if (initialAddress?.latitude && initialAddress?.longitude) {
            setPosition([initialAddress.latitude, initialAddress.longitude]);
          }
        }
      );
    } else if (initialAddress?.latitude && initialAddress?.longitude) {
      setPosition([initialAddress.latitude, initialAddress.longitude]);
    }
  }, []);

  // Reverse geocoding using OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};

        const newAddressData: AddressData = {
          addressLine1: [
            address.house_number,
            address.road || address.pedestrian || address.footway
          ].filter(Boolean).join(' ') || '',
          addressLine2: address.building || address.neighbourhood || '',
          city: address.city || address.town || address.village || address.municipality || '',
          stateProvince: address.state || address.state_district || '',
          postalCode: address.postcode || '',
          country: address.country || '',
          countryCode: address.country_code?.toUpperCase() || '',
          latitude: lat,
          longitude: lng,
          area: address.suburb || address.district || address.county || '',
          displayName: data.display_name || '',
        };

        setAddressData(newAddressData);
        onAddressChange(newAddressData);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Forward geocoding (search for address)
  const searchAddress = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);

          setPosition([lat, lng]);
          reverseGeocode(lat, lng);
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkerDragEnd = (event: any) => {
    const marker = event.target;
    const position = marker.getLatLng();
    setPosition([position.lat, position.lng]);
    reverseGeocode(position.lat, position.lng);
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

  if (!mapReady) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-50 rounded-lg p-8`}>
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
            placeholder="Search for an address..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={searchAddress}
          disabled={isLoading}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200">
          <MapContainer
            center={position}
            zoom={15}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={position}
              draggable={true}
              eventHandlers={{
                dragend: handleMarkerDragEnd,
              }}
              ref={markerRef}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold mb-1">Selected Location</p>
                  <p className="text-xs text-gray-600">{addressData.displayName || 'Drag marker to select location'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
            <MapEventHandler onLocationChange={handleLocationChange} />
          </MapContainer>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <Loader className="h-5 w-5 animate-spin text-gray-600" />
              <span className="text-sm text-gray-600">Getting address...</span>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="flex items-start space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <MapPin className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-gray-700">How to use:</p>
          <ul className="text-xs mt-1 space-y-1">
            <li>• Click anywhere on the map to set your location</li>
            <li>• Drag the marker to adjust the position</li>
            <li>• Use the search bar to find a specific address</li>
            <li>• Address fields will update automatically</li>
          </ul>
        </div>
      </div>

      {/* Detected Address Info */}
      {addressData.area && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <p className="font-medium text-gray-700 mb-1">Detected Location:</p>
          <p className="text-xs text-gray-600">
            Area: {addressData.area}
            {addressData.latitude && addressData.longitude && (
              <span className="ml-2">
                (GPS: {addressData.latitude.toFixed(6)}, {addressData.longitude.toFixed(6)})
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}