'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader, Search, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

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

export default function MapPickerSimple({ initialAddress, onAddressChange, className = '' }: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(true); // Default to true
  const [locationError, setLocationError] = useState('');
  const [showInitialTip, setShowInitialTip] = useState(true);
  const [addressData, setAddressData] = useState<AddressData>({
    addressLine1: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
  });

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize the map
    const initialLat = initialAddress?.latitude || 25.2048;
    const initialLng = initialAddress?.longitude || 55.2708;

    map.current = L.map(mapContainer.current).setView([initialLat, initialLng], 15);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add marker
    marker.current = L.marker([initialLat, initialLng], { draggable: true })
      .addTo(map.current)
      .bindPopup('Drag to adjust location');

    // Handle marker drag
    marker.current.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      reverseGeocode(latlng.lat, latlng.lng);
    });

    // Handle map click
    map.current.on('click', (e) => {
      if (marker.current) {
        marker.current.setLatLng(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      }
    });

    // Auto-get current location on mount (since useCurrentLocation defaults to true)
    if (initialAddress?.latitude && initialAddress?.longitude) {
      map.current.setView([initialAddress.latitude, initialAddress.longitude], 15);
      marker.current.setLatLng([initialAddress.latitude, initialAddress.longitude]);
      reverseGeocode(initialAddress.latitude, initialAddress.longitude);
    } else {
      // Automatically try to get current location on mount
      getCurrentLocation();
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        marker.current = null;
      }
    };
  }, []);

  // Reverse geocoding using OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=en`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const address = data.address || {};

        // Determine the best available street name
        const streetName = address.road ||
                          address.pedestrian ||
                          address.footway ||
                          address.residential ||
                          address.street ||
                          address.path ||
                          '';

        const newAddressData: AddressData = {
          addressLine1: [
            address.house_number,
            streetName
          ].filter(Boolean).join(' ') || streetName || '',
          addressLine2: address.building || address.neighbourhood || address.amenity || '',
          city: address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                address.suburb ||
                address.district ||
                '',
          stateProvince: address.state || address.state_district || address.region || '',
          postalCode: address.postcode || '',
          country: address.country || '',
          countryCode: address.country_code?.toUpperCase() || '',
          latitude: lat,
          longitude: lng,
          area: address.suburb || address.neighbourhood || address.district || address.county || '',
          displayName: data.display_name || '',
        };

        setAddressData(newAddressData);
        onAddressChange(newAddressData);

        // Update popup
        if (marker.current) {
          marker.current.bindPopup(`
            <div style="font-size: 12px;">
              <strong>Selected Location</strong><br/>
              ${data.display_name || 'Unknown location'}<br/>
              <small>Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}</small>
            </div>
          `).openPopup();
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect if user is on mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Detect specific mobile OS
  const getMobileOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    if (/android/i.test(userAgent)) return 'android';
    if (/iPad|iPhone|iPod/.test(userAgent)) return 'ios';
    return 'other';
  };

  // Get current location from GPS/mobile
  const getCurrentLocation = () => {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setUseCurrentLocation(false);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (map.current && marker.current) {
          map.current.setView([latitude, longitude], 16);
          marker.current.setLatLng([latitude, longitude]);
          reverseGeocode(latitude, longitude);
        }
        setIsLoading(false);
        setLocationError('');
        setShowInitialTip(false);
      },
      (error) => {
        let errorMsg = 'Unable to get location';
        let showSettings = false;

        switch(error.code) {
          case error.PERMISSION_DENIED:
            if (isMobileDevice()) {
              const os = getMobileOS();
              const browserName = (() => {
                const ua = navigator.userAgent;
                if (ua.includes('Chrome')) return 'Chrome';
                if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
                if (ua.includes('Firefox')) return 'Firefox';
                if (ua.includes('Samsung')) return 'Samsung Internet';
                return 'your browser';
              })();

              if (os === 'ios') {
                if (browserName === 'Safari') {
                  errorMsg = '📍 Location blocked for Safari. Follow these steps:\n\n📱 On your iPhone/iPad:\n1. Exit this page and go to your Home Screen\n2. Open the "Settings" app (gray icon with gears)\n3. Scroll down and tap "Safari"\n4. Scroll to "Settings for Websites" section\n5. Tap "Location"\n6. Select "Ask" or "Allow"\n7. Come back here and tap the checkbox again\n\n💡 Quick tip: Swipe down from top-right and check if Location (arrow icon) is enabled';
                } else {
                  errorMsg = `📍 Location blocked for ${browserName}. Follow these steps:\n\n📱 On your iPhone/iPad:\n1. Exit this page and go to your Home Screen\n2. Open the "Settings" app (gray icon with gears)\n3. Scroll down and find "${browserName}"\n4. Tap on "${browserName}"\n5. Tap "Location" or "Location Access"\n6. Select "While Using App" or "Always"\n7. Come back here and tap the checkbox again\n\n⚡ Alternative: Try using Safari browser instead`;
                }
              } else if (os === 'android') {
                if (browserName === 'Chrome') {
                  errorMsg = '📍 Location blocked for Chrome. Follow these steps:\n\n📱 Method 1 - Quick Settings:\n1. Swipe down from the top of your screen twice\n2. Long press the "Location" tile\n3. Make sure Location is ON\n4. Find "Chrome" in the app list\n5. Tap it and select "Allow only while using app"\n\n📱 Method 2 - Chrome Settings:\n1. Tap the three dots (⋮) in Chrome\'s top-right\n2. Tap "Settings"\n3. Tap "Site settings"\n4. Tap "Location"\n5. Turn on "Location"\n6. Come back and reload this page\n\n💡 Also check: Pull down notification panel and ensure GPS/Location icon is ON';
                } else if (browserName === 'Samsung Internet') {
                  errorMsg = '📍 Location blocked for Samsung Internet. Follow these steps:\n\n📱 In Samsung Internet Browser:\n1. Tap the menu (≡) at bottom\n2. Tap "Settings"\n3. Tap "Sites and downloads"\n4. Tap "Site permissions"\n5. Tap "Location"\n6. Turn on "Ask before accessing"\n7. Go back and reload this page\n\n📱 Also check phone settings:\n1. Open Settings → Location\n2. Make sure it\'s ON\n3. Tap "App permissions"\n4. Find "Samsung Internet" and allow';
                } else {
                  errorMsg = `📍 Location blocked. Follow these steps:\n\n📱 Quick Fix - Phone Settings:\n1. Swipe down from top of screen (notification panel)\n2. Find and long-press "Location" or "GPS" icon\n3. Turn ON Location/GPS\n4. Set to "High accuracy" mode\n5. Find "${browserName}" in app list\n6. Set to "Allow only while using app"\n\n📱 Then in ${browserName}:\n• Look for location icon in address bar\n• Tap it and select "Allow"\n• Or check browser Settings → Site permissions → Location\n\n💡 Quick check: Is the GPS/Location icon showing in your status bar?`;
                }
              } else {
                errorMsg = '📍 Location permission denied. Please enable location access in your browser settings and refresh the page.';
              }
              showSettings = true;
            } else {
              errorMsg = 'Location permission denied. Click the location icon in your browser\'s address bar to enable access.';
            }
            break;
          case error.POSITION_UNAVAILABLE:
            if (isMobileDevice()) {
              const os = getMobileOS();
              if (os === 'ios') {
                errorMsg = '📡 GPS/Location is OFF on your iPhone/iPad:\n\n📱 Turn on Location Services:\n1. Go to Home Screen\n2. Open "Settings" app (gray icon)\n3. Tap "Privacy & Security" (blue hand icon)\n4. Tap "Location Services" at the top\n5. Toggle ON the switch at top (should turn green)\n\n✅ Also check these:\n• Control Center: Swipe down from top-right, check if location arrow is blue\n• WiFi: Should be ON for accurate location\n• Airplane mode: Should be OFF\n\n💡 If still not working:\n• Go to Settings → General → Reset\n• Tap "Reset Location & Privacy"\n• Try again';
              } else if (os === 'android') {
                errorMsg = '📡 GPS/Location is OFF on your phone:\n\n📱 Quick Toggle:\n1. Swipe down from top of screen (once or twice)\n2. Find "Location" or "GPS" tile/icon\n3. Tap it to turn ON (should be highlighted/blue)\n\n📱 If not there, go to Settings:\n1. Open Settings app\n2. Tap "Location" (or "Security & Location")\n3. Toggle ON the main switch\n4. Tap "Mode" or "Location mode"\n5. Select "High accuracy" (uses GPS, WiFi, and mobile)\n\n✅ Make sure:\n• WiFi is ON (even if not connected)\n• Airplane mode is OFF\n• Battery saver is OFF (can limit GPS)\n\n💡 Still not working? Restart your phone and try again';
              } else {
                errorMsg = '📡 Location unavailable. Please enable GPS/Location services in your device settings.';
              }
              showSettings = true;
            } else {
              errorMsg = 'Location information unavailable. Please check your network connection.';
            }
            break;
          case error.TIMEOUT:
            errorMsg = '⏱️ Location request timed out. Please try again or enter address manually.';
            break;
        }
        setLocationError(errorMsg);
        setUseCurrentLocation(false);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Handle checkbox change
  const handleUseCurrentLocationChange = (checked: boolean) => {
    setUseCurrentLocation(checked);
    if (checked) {
      getCurrentLocation();
    }
  };

  // Forward geocoding (search for address)
  const searchAddress = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1&accept-language=en`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);

          if (map.current && marker.current) {
            map.current.setView([lat, lng], 15);
            marker.current.setLatLng([lat, lng]);
            reverseGeocode(lat, lng);
          }
        } else {
          alert('No results found for this address. Try being more specific or use a different search term.');
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Error searching for address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${className} space-y-4`}>
      {/* Initial Location Detection Tip */}
      {showInitialTip && isLoading && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
            <p className="text-sm text-green-800 font-medium">
              Detecting your current location automatically...
            </p>
          </div>
          <p className="text-xs text-green-600 mt-1 ml-6">
            {isMobileDevice()
              ? "You may be prompted to allow location access. Please tap 'Allow' to continue."
              : "You may see a browser prompt asking for location permission. Please click 'Allow'."}
          </p>
        </div>
      )}

      {/* Current Location Checkbox */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={useCurrentLocation}
            onChange={(e) => handleUseCurrentLocationChange(e.target.checked)}
            disabled={isLoading}
            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            <span className="font-medium text-gray-900">Use my current location</span>
            <p className="text-sm text-gray-600 mt-0.5">
              Automatically detect your location from GPS/mobile signal
            </p>
            {locationError && (
              <div className="text-sm text-red-600 mt-2 bg-red-50 border border-red-200 rounded-md p-4">
                {locationError.split('\n').map((line, index) => {
                  // Style different line types
                  let className = '';
                  let content = line;

                  if (line.startsWith('📱')) {
                    className = 'font-semibold text-red-700 mt-3 mb-1';
                  } else if (line.startsWith('📍') || line.startsWith('📡')) {
                    className = 'font-bold text-red-800 text-base mb-2';
                  } else if (line.startsWith('💡') || line.startsWith('⚡') || line.startsWith('✅')) {
                    className = 'text-amber-700 bg-amber-50 p-2 rounded mt-3 text-xs';
                  } else if (line.match(/^\d+\./)) {
                    className = 'ml-4 text-gray-700 leading-relaxed';
                  } else if (line.startsWith('•')) {
                    className = 'ml-6 text-gray-600 text-xs';
                  } else if (line.startsWith(' ')) {
                    className = 'ml-4 text-gray-600';
                  }

                  return (
                    <div key={index} className={className}>
                      {content}
                    </div>
                  );
                })}
                {isMobileDevice() && (
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const os = getMobileOS();
                        if (os === 'android') {
                          // Try multiple methods to open settings on Android
                          const settingsUrls = [
                            'intent://settings#Intent;action=android.settings.LOCATION_SOURCE_SETTINGS;end',
                            'intent://settings#Intent;action=android.settings.SETTINGS;end',
                            'android-app://com.android.settings'
                          ];

                          let opened = false;
                          for (const url of settingsUrls) {
                            try {
                              window.location.href = url;
                              opened = true;
                              break;
                            } catch (e) {
                              continue;
                            }
                          }

                          if (!opened) {
                            alert('Please open Settings app manually:\n\n1. Exit this browser\n2. Find and tap the Settings app (gear icon)\n3. Look for "Location" or "Privacy"');
                          }
                        } else if (os === 'ios') {
                          // iOS doesn't allow direct settings access from web
                          alert('On iPhone/iPad:\n\n1. Press the Home button or swipe up\n2. Find and tap the Settings app (gray gear icon)\n3. Look for "Privacy & Security" → "Location Services"\n\nOr try: Settings → Safari → Location');
                        }
                      }}
                      className="flex-1 text-xs bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors font-medium"
                    >
                      📲 Open Device Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationError('');
                        setUseCurrentLocation(false);
                      }}
                      className="text-xs bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                searchAddress();
              }
            }}
            placeholder="Search for an address, landmark, or area..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        <button
          type="button"
          onClick={searchAddress}
          disabled={isLoading || !searchQuery.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapContainer}
          className="h-96 w-full rounded-lg overflow-hidden border-2 border-gray-200"
        />

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
      {(addressData.area || addressData.addressLine1 || addressData.city) && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <p className="font-medium text-gray-700 mb-2">Detected Location:</p>
          <div className="space-y-1 text-xs text-gray-600">
            {addressData.area && (
              <p><span className="font-medium">Area:</span> {addressData.area}</p>
            )}
            {addressData.addressLine1 && (
              <p><span className="font-medium">Street:</span> {addressData.addressLine1}</p>
            )}
            {addressData.city && (
              <p><span className="font-medium">City:</span> {addressData.city}</p>
            )}
            {addressData.country && (
              <p><span className="font-medium">Country:</span> {addressData.country}</p>
            )}
            {addressData.latitude && addressData.longitude && (
              <p className="text-gray-500 mt-1">
                GPS: {addressData.latitude.toFixed(6)}, {addressData.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}