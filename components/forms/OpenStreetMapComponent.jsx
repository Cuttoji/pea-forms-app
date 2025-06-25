import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- โค้ดส่วนนี้สำคัญมาก ---
// แก้ปัญหา Marker Icon ไม่แสดงผลใน React
// A fix for the default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      if (onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function OpenStreetMapComponent({ onLocationSelect }) {
  // ตั้งค่าพิกัดเริ่มต้นที่กรุงเทพฯ
  const initialPosition = [13.7563, 100.5018]; 

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer 
        center={initialPosition} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
}