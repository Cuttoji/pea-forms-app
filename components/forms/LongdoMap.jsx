// app/components/forms/LongdoMap.jsx
"use client";

import React, { useEffect, useRef, useState } from 'react';

// ฟังก์ชันสำหรับโหลด Longdo Map API Script
const loadLongdoMapScript = (apiKey, callback) => {
  if (window.longdo) {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.src = `https://api.longdo.com/map/?key=${apiKey}`;
  script.onload = () => callback();
  script.onerror = () => console.error("Longdo Map script failed to load.");
  document.head.appendChild(script);
};


const LongdoMap = ({ onLocationSelect }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // เก็บ instance ของ map
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_LONGDO_MAP_KEY;
    if (!apiKey) {
      console.error("Longdo Map API Key is missing.");
      return;
    }

    loadLongdoMapScript(apiKey, () => {
      if (!mapContainerRef.current) return;
      
      const map = new window.longdo.Map({
        placeholder: mapContainerRef.current,
        language: 'th',
      });
      mapRef.current = map; // เก็บ map instance ไว้ใน ref
      setIsMapReady(true);
    });

  }, []);

  // useEffect สำหรับจัดการ event ของ map
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    const map = mapRef.current;
    
    // Event เมื่อคลิกบนแผนที่
    map.Event.bind('click', () => {
        const location = map.location();
        map.Overlays.clear(); // ล้างหมุดเก่า
        map.Overlays.add(new window.longdo.Marker(location));
        getAddressFromLocation(location);
    });

    // Event หลังจากค้นหาสำเร็จ
    map.Event.bind('search', (results) => {
        if (results.data.length > 0) {
            const firstResult = results.data[0];
            map.location({ lon: firstResult.lon, lat: firstResult.lat }, true);
            getAddressFromLocation({ lon: firstResult.lon, lat: firstResult.lat });
        }
    });

  }, [isMapReady]);

  const getAddressFromLocation = (location) => {
    mapRef.current.Service.address(location, (result) => {
        const address = `${result.subdistrict}, ${result.district}, ${result.province} ${result.postcode}`;
        console.log("Selected Location:", { address, ...location });
        if (typeof onLocationSelect === 'function') {
            onLocationSelect({ address, lat: location.lat, lon: location.lon });
        }
    });
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery || !mapRef.current) return;
    mapRef.current.Service.search(searchQuery);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อสถานที่ หรือ ที่อยู่..."
          className="w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-pea-primary focus:border-pea-primary"
        />
        <button 
          onClick={handleSearch}
          className="px-4 py-2 bg-pea-primary text-white font-semibold rounded-lg shadow hover:bg-pea-dark"
        >
          ค้นหา
        </button>
      </div>
      <div 
        ref={mapContainerRef} 
        id="longdo-map"
        style={{ height: '400px', width: '100%' }}
        className="rounded-lg border border-gray-300"
      >
        {!isMapReady && <p className="p-4 text-gray-500">กำลังโหลดแผนที่...</p>}
      </div>
    </div>
  );
};

export default LongdoMap;