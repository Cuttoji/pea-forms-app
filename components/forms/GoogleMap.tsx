// components/forms/GoogleMap.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

// ตำแหน่งเริ่มต้น (สำนักงานใหญ่ กฟภ.)
const defaultCenter = {
  lat: 13.819183,
  lng: 100.543437
};

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function GoogleMapComponent({ address }: { address: string }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_Maps_API_KEY || "",
  });

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  const debouncedAddress = useDebounce(address, 1000); // รอ 1 วินาทีหลังจากผู้ใช้พิมพ์เสร็จ

  useEffect(() => {
    if (!debouncedAddress || !isLoaded) {
      setMarkerPosition(null);
      setStatus('idle');
      return;
    }

    const geocodeAddress = async () => {
      setStatus('loading');
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(debouncedAddress)}&key=${process.env.NEXT_PUBLIC_Maps_API_KEY}`);
        const data = await response.json();

        if (data.status === 'OK' && data.results[0]) {
          const location = data.results[0].geometry.location; // { lat, lng }
          setMapCenter(location);
          setMarkerPosition(location);
          setStatus('success');
        } else {
          console.error('Geocoding failed:', data.status, data.error_message);
          setMarkerPosition(null);
          setStatus('error');
        }
      } catch (error) {
        console.error('Error fetching geocode data:', error);
        setStatus('error');
      }
    };

    geocodeAddress();
  }, [debouncedAddress, isLoaded]);

  const renderMap = () => (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={markerPosition ? 16 : 10}
      >
        {markerPosition && (
          <MarkerF
            position={markerPosition}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            }}
          />
        )}
      </GoogleMap>
      {status === 'loading' && (
        <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-lg text-sm">
          <p>กำลังค้นหาตำแหน่ง...</p>
        </div>
      )}
       {status === 'error' && (
        <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-lg text-sm text-red-600">
          <p>ไม่พบที่อยู่ที่ระบุ</p>
        </div>
      )}
    </div>
  );

  return isLoaded ? renderMap() : <div>กำลังโหลดแผนที่...</div>;
}