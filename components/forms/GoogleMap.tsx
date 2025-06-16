'use client';

import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { toast } from 'sonner'; // เราจะใช้ toast สำหรับแจ้งเตือน
import { LocateFixed } from 'lucide-react'; // ไอคอนสวยๆ

// ต้องระบุ 'places' library เพื่อใช้งาน Autocomplete
const libraries: ('places')[] = ['places'];

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  position: 'relative' as 'relative', // ทำให้เราวางปุ่มทับบนแผนที่ได้
};

const center = {
  lat: 13.7563,
  lng: 100.5018,
};

interface GoogleMapComponentProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  initialPosition?: { lat: number; lng: number };
}

function GoogleMapComponent({ onLocationSelect, initialPosition }: GoogleMapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_Maps_API_KEY!,
    libraries: libraries, // เพิ่มบรรทัดนี้
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(initialPosition || null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // Callback เมื่อมีการคลิกบนแผนที่
  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(newPosition);
      onLocationSelect(newPosition);
    }
  }, [onLocationSelect]);

  // Handler สำหรับ Autocomplete Search Box
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const newPosition = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        map?.panTo(newPosition);
        map?.setZoom(15);
        setMarkerPosition(newPosition);
        onLocationSelect(newPosition);
      }
    }
  };
  
  // Handler สำหรับปุ่ม "ตำแหน่งปัจจุบัน"
  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map?.panTo(newPosition);
          map?.setZoom(15);
          setMarkerPosition(newPosition);
          onLocationSelect(newPosition);
          toast.success('พบตำแหน่งปัจจุบันของคุณแล้ว');
        },
        () => {
          toast.error('ไม่สามารถเข้าถึงตำแหน่งของคุณได้ โปรดตรวจสอบการตั้งค่าเบราว์เซอร์');
        }
      );
    } else {
      toast.error('เบราว์เซอร์ของคุณไม่รองรับ Geolocation');
    }
  };

  return isLoaded ? (
    <div style={{ position: 'relative' }}>
      {/* Search Box */}
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: 'th' }, // จำกัดการค้นหาในประเทศไทย
        }}
      >
        <input
          type="text"
          placeholder="ค้นหาที่อยู่หรือสถานที่..."
          style={{
            color: `#000000`,
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `100%`,
            height: `40px`,
            padding: `0 12px`,
            borderRadius: `4px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
            marginBottom: '10px',
          }}
        />
      </Autocomplete>

      {/* Map Container */}
      <div style={containerStyle}>
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={markerPosition || center}
          zoom={markerPosition ? 15 : 10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
          options={{
            streetViewControl: false, // ปิด Street View
            mapTypeControl: false,    // ปิดปุ่มเลือกประเภทแผนที่
          }}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
        
        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleCurrentLocationClick}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            padding: '0',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            
          }}
          title="ไปที่ตำแหน่งปัจจุบัน"
        >
          <LocateFixed size={20} />
        </button>
      </div>
    </div>
  ) : (
    <div>Loading Map...</div>
  );
}

export default React.memo(GoogleMapComponent);