"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Locate, Layers, ZoomIn, ZoomOut, CheckCircle, ExternalLink, Search, X, MapPin } from "lucide-react";
import { MapMarker } from "@/components/map-marker";
import { MapItemCard } from "@/components/map-item-card";

interface MapScreenProps {
  items: any[];
  nearbyItemId?: string;
  onNavigate: (item: any, mapService?: string) => void;
  preferredMapService?: string;
  onUpdateItem?: (item: any) => void;
}

// Map service deep link generators
const mapDeepLinks = {
  naver: (lat: number, lng: number, name: string) => 
    `nmap://place?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}&appname=com.nearbuy`,
  kakao: (lat: number, lng: number, name: string) => 
    `kakaomap://look?p=${lat},${lng}`,
  google: (lat: number, lng: number, name: string) => 
    `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  apple: (lat: number, lng: number, name: string) => 
    `maps://?ll=${lat},${lng}&q=${encodeURIComponent(name)}`,
};

const markerPositions: any = {
  "1": { top: "30%", left: "25%", lat: 37.5665, lng: 126.978 },
  "2": { top: "45%", left: "60%", lat: 37.5012, lng: 127.0396 },
  "3": { top: "55%", left: "35%", lat: 37.4979, lng: 127.0276 },
  "4": { top: "65%", left: "70%", lat: 37.5172, lng: 127.0473 },
  "5": { top: "40%", left: "45%", lat: 37.5045, lng: 127.0498 },
};

// Sample place search results
const samplePlaces = [
  { id: "p1", name: "다이소 강남역점", address: "서울 강남구 강남대로 396", lat: 37.5665, lng: 126.978 },
  { id: "p2", name: "이마트 역삼점", address: "서울 강남구 테헤란로 156", lat: 37.5012, lng: 127.0396 },
  { id: "p3", name: "홈플러스 강남점", address: "서울 강남구 삼성로 511", lat: 37.4979, lng: 127.0276 },
  { id: "p4", name: "올리브영 삼성역점", address: "서울 강남구 테헤란로 416", lat: 37.5172, lng: 127.0473 },
  { id: "p5", name: "CU 편의점 삼성점", address: "서울 강남구 삼성로 96길 12", lat: 37.5045, lng: 127.0498 },
  { id: "p6", name: "다이소 삼성점", address: "서울 강남구 테헤란로 518", lat: 37.5080, lng: 127.0550 },
  { id: "p7", name: "롯데마트 강남점", address: "서울 강남구 도산대로 402", lat: 37.5200, lng: 127.0290 },
];

export function MapScreen({ items, nearbyItemId, onNavigate, preferredMapService = "naver", onUpdateItem }: MapScreenProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showNavigateSuccess, setShowNavigateSuccess] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof samplePlaces>([]);

  // Filter places based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = samplePlaces.filter(place => 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Auto-select nearby item when it becomes available
  useEffect(() => {
    if (nearbyItemId) {
      const nearbyItem = items.find((item: any) => item.id === nearbyItemId);
      if (nearbyItem) {
        setSelectedItem(nearbyItem);
      }
    }
  }, [nearbyItemId, items]);

  const handleMarkerClick = (item: any) => {
    setSelectedItem(item);
  };

  const handleNavigate = (mapService: string = preferredMapService) => {
    if (!selectedItem) return;
    
    // Use item's coordinates if available, otherwise fall back to marker positions
    const lat = selectedItem.lat || markerPositions[selectedItem.id]?.lat || 37.5665;
    const lng = selectedItem.lng || markerPositions[selectedItem.id]?.lng || 126.978;
    const deepLinkGenerator = mapDeepLinks[mapService as keyof typeof mapDeepLinks];
    
    if (deepLinkGenerator) {
      const deepLink = deepLinkGenerator(lat, lng, selectedItem.location || selectedItem.name);
      
      // Try to open the deep link
      window.open(deepLink, "_blank");
      
      // Show success feedback
      setShowNavigateSuccess(true);
      setTimeout(() => setShowNavigateSuccess(false), 2000);
      
      // Also call the parent onNavigate for any additional handling
      onNavigate(selectedItem, mapService);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="relative h-screen bg-background overflow-hidden">
      {/* Map Placeholder */}
      <motion.div 
        className="absolute inset-0 bg-secondary origin-center"
        animate={{ scale: zoomLevel }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        {/* Grid pattern to simulate map */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Simulated roads */}
        <div className="absolute top-1/4 left-0 right-0 h-8 bg-muted-foreground/10 transform -rotate-12" />
        <div className="absolute top-1/2 left-0 right-0 h-6 bg-muted-foreground/10" />
        <div className="absolute top-0 bottom-0 left-1/3 w-6 bg-muted-foreground/10" />
        <div className="absolute top-0 bottom-0 left-2/3 w-8 bg-muted-foreground/10 transform rotate-6" />

        {/* Place markers for items */}
        {items
          .filter((item: any) => !item.completed)
          .map((item: any) => (
            <MapMarker
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              isNearby={item.id === nearbyItemId}
              onClick={() => handleMarkerClick(item)}
              style={markerPositions[item.id] || { top: "50%", left: "50%" }}
            />
          ))}

        {/* Current location indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="w-4 h-4 bg-primary rounded-full shadow-lg" />
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
          </div>
        </motion.div>
      </motion.div>

      {/* Header overlay with search */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-background via-background/80 to-transparent z-10"
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground">주변 매장</h1>
          {nearbyItemId && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full"
            >
              <span className="text-xs font-medium text-primary">
                근처에 매장이 있어요!
              </span>
            </motion.div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className={`flex items-center gap-2 px-3 py-2.5 bg-card border rounded-xl shadow-sm transition-all ${
            isSearchFocused ? "border-primary ring-2 ring-primary/20" : "border-border"
          }`}>
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="장소 검색 (다이소, 이마트...)"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {isSearchFocused && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto z-20"
              >
                {searchResults.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => {
                      // Create a virtual item from the place to show on map
                      setSelectedItem({
                        id: place.id,
                        name: place.name,
                        location: place.address,
                        lat: place.lat,
                        lng: place.lng,
                        category: "검색 결과",
                      });
                      setSearchQuery("");
                      setIsSearchFocused(false);
                    }}
                    className="w-full flex items-start gap-3 p-3 hover:bg-secondary/50 transition-colors border-b border-border last:border-b-0"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-card-foreground">{place.name}</p>
                      <p className="text-xs text-muted-foreground">{place.address}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* No results message */}
          <AnimatePresence>
            {isSearchFocused && searchQuery.length > 0 && searchResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg p-4 text-center"
              >
                <p className="text-sm text-muted-foreground">검색 결과가 없습니다</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Map controls */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute right-4 top-1/3 flex flex-col gap-2"
      >
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-card rounded-xl shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <Layers className="w-5 h-5 text-card-foreground" />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="w-10 h-10 bg-card rounded-xl shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ZoomIn className="w-5 h-5 text-card-foreground" />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="w-10 h-10 bg-card rounded-xl shadow-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ZoomOut className="w-5 h-5 text-card-foreground" />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-primary rounded-xl shadow-lg flex items-center justify-center"
        >
          <Locate className="w-5 h-5 text-primary-foreground" />
        </motion.button>
      </motion.div>

      {/* Navigate Success Toast */}
      <AnimatePresence>
        {showNavigateSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 bg-card border border-border rounded-xl shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-card-foreground">지도 앱을 열었습니다</span>
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item summary card */}
      <MapItemCard
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onNavigate={handleNavigate}
        preferredMapService={preferredMapService}
        onUpdateItem={onUpdateItem}
      />

      {/* Bottom padding for tab bar */}
      <div className="h-20" />
    </div>
  );
}
