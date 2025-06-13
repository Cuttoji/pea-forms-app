"use client";

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    longdo: {
      Map: any;
      Marker: any;
    };
  }
}

interface LongdoMapProps {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lon: number;
  }) => void;
}

export default function LongdoMap({ onLocationSelect }: LongdoMapProps) {
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let hasScript = false;
    const existingScript = document.querySelector('script[src*="api.longdo.com/map"]');
    
    if (existingScript) {
      hasScript = true;
      initializeMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://api.longdo.com/map/?key=YOUR_KEY';
      script.async = true;
      script.onload = () => {
        hasScript = true;
        initializeMap();
      };
      document.body.appendChild(script);
    }

    function initializeMap() {
      if (!window.longdo || !mapRef.current || mapInstanceRef.current) return;

      try {
        mapInstanceRef.current = new window.longdo.Map({
          placeholder: mapRef.current,
          zoom: 12,
        });

        mapInstanceRef.current.Event.bind('click', (location: any) => {
          const { lat, lon } = location;
          
          if (markerRef.current) {
            mapInstanceRef.current.Overlays.remove(markerRef.current);
          }

          markerRef.current = new window.longdo.Marker({ lat, lon });
          mapInstanceRef.current.Overlays.add(markerRef.current);

          fetch(`https://api.longdo.com/map/services/address?key=YOUR_KEY&lat=${lat}&lon=${lon}`)
            .then(res => res.json())
            .then(data => {
              onLocationSelect({
                address: data.address || '',
                lat,
                lon
              });
            })
            .catch(console.error);
        });
      } catch (error) {
        console.error('Error initializing Longdo Map:', error);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
      if (!hasScript) {
        const script = document.querySelector('script[src*="api.longdo.com/map"]');
        if (script) {
          document.body.removeChild(script);
        }
      }
    };
  }, [onLocationSelect]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-lg border border-gray-300 shadow-inner"
    />
  );
}
