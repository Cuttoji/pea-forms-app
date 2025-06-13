"use client";

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { Search } from 'lucide-react';

// Add type definitions for Longdo Map
declare global {
  interface Window {
    longdo: {
      Map: any;
      Marker: any;
      SearchResult: any;
    };
  }
}

export default function LongdoMap({ onLocationSelect }) {
  const [map, setMap] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // Get API key from environment variables with fallback
  const API_KEY = process.env.NEXT_PUBLIC_LONGDO_MAP_API_KEY;

  // Validate API key before rendering script
  if (!API_KEY) {
    console.error('Longdo Map API Key is not set in environment variables');
    return (
      <div className="w-full h-72 border rounded-lg shadow-inner bg-gray-100 flex justify-center items-center">
        <p className="text-red-600">กรุณาตั้งค่า Longdo Map API Key ใน .env.local</p>
      </div>
    );
  }

  // 1. ใช้ useEffect เพื่อรอให้ window.longdo พร้อมใช้งาน
  useEffect(() => {
    if (!isScriptLoaded) return;

    // สร้าง Interval เพื่อเช็คทุกๆ 100ms
    const intervalId = setInterval(() => {
      // เมื่อ window.longdo พร้อมใช้งานแล้ว
      if (window.longdo) {
        clearInterval(intervalId); // หยุดการเช็ค
        initializeMap(); // เริ่มสร้างแผนที่
      }
    }, 100);

    // Cleanup function เพื่อลบ interval หาก component ถูก unmount
    return () => clearInterval(intervalId);

  }, [isScriptLoaded]); // Effect นี้จะทำงานเมื่อ isScriptLoaded เป็น true


  const initializeMap = () => {
    try {
      const longdo = window.longdo;
      const mapInstance = new longdo.Map({
        placeholder: document.getElementById('longdo-map'),
        language: 'th',
      });
      
      // เพิ่ม Event Listener สำหรับการคลิกบนแผนที่
      mapInstance.Event.bind('click', (e) => handleMapClick(mapInstance, e));
      
      setMap(mapInstance);

    } catch (error) {
      console.error("Failed to initialize Longdo Map:", error);
    }
  };
  
  const handleMapClick = (mapInstance, event) => {
      const mouseLocation = mapInstance.location('POINTER');
      mapInstance.Overlays.clear(); // ล้างหมุดเก่า
      mapInstance.Overlays.add(new window.longdo.Marker(mouseLocation));
      mapInstance.location(mouseLocation, true);
      
      // แปลงพิกัดเป็นที่อยู่
      mapInstance.Search.search(mouseLocation, {
        span: '1km',
        callback: (result) => {
          let address = 'ไม่สามารถระบุที่อยู่ได้';
          if(result.data && result.data.length > 0) {
              const closest = result.data.find(d => d.name && d.address) || result.data[0];
              address = `${closest.name ? closest.name + ' ' : ''}${closest.address || ''}`.trim();
          }
          const location = { address: address, lat: mouseLocation.lat, lon: mouseLocation.lon };
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
            const location = {
              address: `${firstResult.name ? firstResult.name + ' ' : ''}${firstResult.address || ''}`.trim(),
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
  
  return (
    <div className="space-y-3">
      {API_KEY && (
        <Script
          src={`https://api.longdo.com/map/?key=${API_KEY}`}
          strategy="afterInteractive"
          onLoad={() => setIsScriptLoaded(true)}
          onError={(e) => console.error("Longdo Map Script failed to load:", e)}
        />
      )}
      
      <div className="flex gap-2 text-gray-700">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          placeholder="ค้นหาชื่อสถานที่ หรือ ที่อยู่..."
          className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
          disabled={!map}
        />
        <button
          type="button"
          onClick={handleSearchClick}
          className="p-2 bg-[#5b2d90] text-white rounded-md hover:bg-[#4a2575] disabled:bg-gray-300"
          disabled={!map}
        >
          <Search size={20} />
        </button>
      </div>
      
      <div id="longdo-map" className="w-full h-72 border rounded-lg shadow-inner bg-gray-100">
        {!API_KEY ? (
            <div className="flex justify-center items-center h-full text-red-600">
                <p>ไม่ได้ตั้งค่า Longdo Map API Key</p>
            </div>
        ) : !isScriptLoaded && (
            <div className="flex justify-center items-center h-full text-gray-500">
                <p>กำลังโหลดสคริปต์แผนที่...</p>
            </div>
        )}
      </div>
    </div>
  );
}