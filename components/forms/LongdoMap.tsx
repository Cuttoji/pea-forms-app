"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { Search, AlertTriangle } from 'lucide-react';


const formatAddress = (result) => {
  if (!result) return 'ไม่สามารถระบุที่อยู่ได้';
  const parts = [
    result.name,
    result.address,
    result.subdistrict,
    result.district,
    result.province,
    result.postcode,
  ];
  const uniqueParts = [...new Set(parts.filter(p => p && p.trim() !== ''))];
  return uniqueParts.join(' ').trim() || 'ไม่สามารถระบุที่อยู่ได้';
};


export default function LongdoMap({ onLocationSelect }) {
  const [map, setMap] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const API_KEY = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;

  useEffect(() => {
    if (!isScriptLoaded || !API_KEY) return;

    const intervalId = setInterval(() => {
      if (window.longdo) {
        clearInterval(intervalId);
        initializeMap();
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [isScriptLoaded, API_KEY]);


  const initializeMap = () => {
    try {
      const longdo = window.longdo;
      const mapInstance = new longdo.Map({
        placeholder: document.getElementById('longdo-map'),
        language: 'th',
      });
      
      mapInstance.Event.bind('click', (e) => handleMapClick(mapInstance, e));
      setMap(mapInstance);
      setIsMapReady(true);

    } catch (error) {
      console.error("Failed to initialize Longdo Map:", error);
    }
  };
  
  const handleMapClick = (mapInstance, event) => {
      const mouseLocation = mapInstance.location('POINTER');
      mapInstance.Overlays.clear();
      mapInstance.Overlays.add(new window.longdo.Marker(mouseLocation));
      mapInstance.location(mouseLocation, true);
      
      mapInstance.Search.search(mouseLocation, {
        span: '1km',
        callback: (result) => {
          const formatted = formatAddress(result.data && result.data.length > 0 ? result.data[0] : null);
          const location = { address: formatted, lat: mouseLocation.lat, lon: mouseLocation.lon };
          
          if (typeof onLocationSelect === 'function') {
            onLocationSelect(location);
          }
        }
      });
  };

  const executeSearch = () => {
    if (map && searchKeyword) {
      map.Search.search(searchKeyword, {
        limit: 10,
        callback: (result) => {
          if (result.data && result.data.length > 0) {
            const firstResult = result.data[0];
            const formatted = formatAddress(firstResult);
            const location = {
              address: formatted,
              lat: firstResult.lat,
              lon: firstResult.lon
            };
            map.location(location, true);
            map.Overlays.clear();
            map.Overlays.add(new window.longdo.Marker({ lon: location.lon, lat: location.lat }));

            if (typeof onLocationSelect === 'function') {
              onLocationSelect(location);
            }
          } else {
             alert("ไม่พบสถานที่ที่ค้นหา");
          }
        }
      });
    }
  };
  
  const handleSearchClick = (e) => {
    e.preventDefault();
    executeSearch();
  };
  
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
    }
  };
  
  if (!API_KEY) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
        <AlertTriangle className="w-12 h-12 mb-2" />
        <p className="font-semibold">เกิดข้อผิดพลาด</p>
        <p className="text-sm">ไม่ได้ตั้งค่า Longdo Map API Key</p>
        <p className="text-xs mt-2 text-red-500">กรุณาตั้งค่า `NEXT_PUBLIC_LONGDO_MAP_API_KEY` ในไฟล์ `.env.local`</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-gray-800">
      <Script
        src={`https://api.longdo.com/map/?key=${API_KEY}`}
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
        onError={(e) => console.error("Longdo Map Script failed to load:", e)}
      />

      <div className="flex gap-2 text-gray-700">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          placeholder="ค้นหาชื่อสถานที่ หรือ ที่อยู่..."
          className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
          disabled={!isMapReady}
        />
        <button
          type="button"
          onClick={handleSearchClick}
          className="p-2 bg-[#5b2d90] text-white rounded-md hover:bg-[#4a2575] disabled:bg-gray-300"
          disabled={!isMapReady}
        >
          <Search size={20} />
        </button>
      </div>
      
      <div id="longdo-map" className="w-full h-72 border rounded-lg shadow-inner bg-gray-100">
      </div>
    </div>
  );
}