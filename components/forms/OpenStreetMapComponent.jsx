import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin } from 'lucide-react';

// แก้ปัญหา Marker Icon ไม่แสดงผล
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function MapEvents({ onLocationSelect }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onLocationSelect({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
}

export default function OpenStreetMapComponent({ onLocationSelect, initialLatitude, initialLongitude }) {
  const initialPosition = [
    initialLatitude || 13.7563,
    initialLongitude || 100.5018
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [mapInstance, setMapInstance] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery || !mapInstance) return;
    
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    
    if (results && results.length > 0) {
      const { y, x } = results[0];
      mapInstance.flyTo([y, x], 16);
    } else {
      alert('ไม่พบสถานที่ที่ค้นหา');
    }
  };

  // ฟังก์ชันสำหรับดักจับการกด Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSearch(e);
    }
  };

  return (
    <div className="relative">
      {/* *** แก้ไขจาก <form> เป็น <div> *** */}
      <div className="absolute top-2 left-2 z-[1000] flex gap-1 bg-white p-1.5 rounded-lg shadow-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // *** เพิ่ม onKeyDown event ***
          placeholder="ค้นหาที่อยู่หรือสถานที่..."
          className="w-48 sm:w-64 border-gray-300 rounded-md shadow-sm focus:ring-pea-primary focus:border-pea-primary text-sm text-gray-900"
        />
        {/* *** แก้ไข type="submit" เป็น type="button" และเพิ่ม onClick event *** */}
        <button 
            type="button" 
            onClick={handleSearch} 
            className="p-2 bg-pea-primary text-white rounded-md hover:bg-pea-dark"
        >
          <Search size={16} />
        </button>
      </div>
      
      {/* ไอคอนหมุดที่ตรึงกลางจอ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none">
        <MapPin size={40} className="text-red-500 drop-shadow-lg" style={{ transform: 'translateY(-50%)' }} />
      </div>

      {/* แผนที่ */}
      <div style={{ height: '450px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer 
          center={initialPosition} 
          zoom={13} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          ref={setMapInstance}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onLocationSelect={onLocationSelect} />
        </MapContainer>
      </div>
    </div>
  );
}