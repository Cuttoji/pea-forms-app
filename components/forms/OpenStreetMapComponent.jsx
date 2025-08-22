import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin } from 'lucide-react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// แก้ปัญหา Marker Icon ไม่แสดงผลในบาง bundler เช่น Webpack/Next.js
// โดยการกำหนด URL ของ icon ด้วย ES6 imports
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// คอมโพเนนต์ MapEvents: สำหรับดักจับ Event ของแผนที่และส่งค่าพิกัดกลับ
function MapEvents({ onLocationSelect }) {
  const map = useMapEvents({
    // เมื่อแผนที่หยุดเลื่อน (moveend), ดึงตำแหน่งศูนย์กลางและส่งกลับไปที่ parent component
    moveend: () => {
      const center = map.getCenter();
      onLocationSelect({ lat: center.lat, lng: center.lng });
    },
  });
  return null; // คอมโพเนนต์นี้ไม่ต้อง render UI ใดๆ
}

// คอมโพเนนต์หลัก OpenStreetMapComponent
export default function OpenStreetMapComponent({ onLocationSelect, initialLatitude, initialLongitude }) {
  // กำหนดตำแหน่งเริ่มต้นของแผนที่ ถ้าไม่มีค่าเริ่มต้น จะใช้พิกัดของกรุงเทพฯ
  const initialPosition = [
    initialLatitude || 13.7563, // ละติจูดเริ่มต้น (กรุงเทพฯ)
    initialLongitude || 100.5018 // ลองจิจูดเริ่มต้น (กรุงเทพฯ)
  ];

  const [searchQuery, setSearchQuery] = useState(''); // State สำหรับเก็บข้อความค้นหา
  const [mapInstance, setMapInstance] = useState(null); // State สำหรับเก็บ instance ของแผนที่ Leaflet

  // ฟังก์ชันสำหรับค้นหาสถานที่ (ใช้ useCallback เพื่อให้ฟังก์ชัน stable)
  const handleSearch = useCallback(async (e) => {
    e.preventDefault(); // ป้องกันการ reload หน้า (ถ้าเป็น submit button)
    if (!searchQuery || !mapInstance) return; // ถ้าไม่มีข้อความค้นหาหรือ map ยังไม่พร้อม ให้หยุด

    const provider = new OpenStreetMapProvider(); // สร้าง Provider สำหรับค้นหา OpenStreetMap
    const results = await provider.search({ query: searchQuery }); // ทำการค้นหา

    if (results && results.length > 0) {
      const { y, x } = results[0]; // ดึงละติจูด (y) และลองจิจูด (x) ของผลลัพธ์แรก
      mapInstance.flyTo([y, x], 16); // ย้ายแผนที่ไปยังตำแหน่งที่ค้นพบพร้อม Zoom level 16
    } else {
      alert('ไม่พบสถานที่ที่ค้นหา'); // แจ้งเตือนถ้าไม่พบสถานที่
    }
  }, [searchQuery, mapInstance]); // Dependencies: ฟังก์ชันจะถูกสร้างใหม่เมื่อ searchQuery หรือ mapInstance เปลี่ยน

  // ฟังก์ชันสำหรับดักจับการกด Enter ในช่องค้นหา (ใช้ useCallback เพื่อให้ฟังก์ชัน stable)
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // ป้องกันการกระทำ default ของ Enter key
      handleSearch(e); // เรียกใช้ฟังก์ชันค้นหา
    }
  }, [handleSearch]); // Dependencies: ฟังก์ชันจะถูกสร้างใหม่เมื่อ handleSearch เปลี่ยน

  return (
    <div className="relative">
      {/* กล่องค้นหาและปุ่ม */}
      <div className="absolute top-2 left-15 z-[1000] flex gap-1 bg-white p-1.5 rounded-lg shadow-lg">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ค้นหาที่อยู่หรือสถานที่..."
          className="w-48 sm:w-64 border-gray-300 rounded-md shadow-sm focus:ring-pea-primary focus:border-pea-primary text-sm text-gray-900"
        />
        <button
          type="button" // กำหนด type เป็น "button" เพื่อป้องกันการ submit form
          onClick={handleSearch}
          className="p-2 bg-pea-primary text-white rounded-md hover:bg-pea-dark"
        >
          <Search size={16} />
        </button>
      </div>

      {/* ไอคอนหมุดที่ตรึงกลางจอ (overlay เหนือแผนที่) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none">
        <MapPin size={40} className="text-red-500 drop-shadow-lg" style={{ transform: 'translateY(-50%)' }} />
      </div>

      {/* แผนที่ OpenStreetMap */}
      <div style={{ height: '450px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer
          center={initialPosition}
          zoom={13}
          scrollWheelZoom={true} // อนุญาตให้ซูมด้วย Mouse Wheel
          style={{ height: '100%', width: '100%' }}
          ref={setMapInstance} // เก็บ instance ของแผนที่ลงใน state
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* คอมโพเนนต์สำหรับดักจับ Event ของแผนที่ */}
          <MapEvents onLocationSelect={onLocationSelect} />
        </MapContainer>
      </div>
    </div>
  );
}