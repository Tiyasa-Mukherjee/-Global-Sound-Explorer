// app/explore/page.tsx
'use client';

import { useState, useEffect, useRef } from "react";
import { 
  Globe, 
  Headphones, 
  Music, 
  Mic2, 
  Smile, 
  Filter, 
  Play, 
  Pause,
  ChevronDown,
  ChevronUp,
  Volume2,
  X,
  Sun,
  Moon,
  Palette
} from "lucide-react";
import clsx from "clsx";
import {auth} from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import ThemeToggle from "../../components/ThemeToggle";
import LoginButton from "../../components/LoginButton";
import { useThemeContext } from "../../components/ThemeContext";
import NavBar from "@/components/NavBar";

type Theme = "light" | "dark" | "pastel";

interface Region {
  id: string;
  name: string;
  coordinates: [number, number];
  color: string;
  audioSample: string;
  description: string;
  genres: string[];
  instruments: string[];
  languages: string[];
  mood: string[];
  culture: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

// --- MOCK DATA FOR DEMO PURPOSES ---
const regionMap: Record<string, Region> = {
  "north-america": {
    id: "north-america",
    name: "North America",
    coordinates: [-100, 40],
    color: "#b3cde0",
    audioSample: "/audio/north-america.mp3",
    description: "Jazz, blues, country, and pop from the US, Canada, and Mexico.",
    genres: ["Jazz", "Blues", "Country", "Pop"],
    instruments: ["Guitar", "Banjo", "Saxophone"],
    languages: ["English", "Spanish", "French"],
    mood: ["Upbeat", "Soulful"],
    culture: "Music is a melting pot of influences, from indigenous to immigrant traditions."
  },
  "south-america": {
    id: "south-america",
    name: "South America",
    coordinates: [-60, -15],
    color: "#fbb4ae",
    audioSample: "/audio/south-america.mp3",
    description: "Samba, tango, and Andean folk from Brazil, Argentina, Peru, and more.",
    genres: ["Samba", "Tango", "Huayno"],
    instruments: ["Panpipes", "Charango", "Guitar"],
    languages: ["Spanish", "Portuguese", "Quechua"],
    mood: ["Festive", "Passionate"],
    culture: "Music is central to festivals, dance, and storytelling."
  },
  "europe": {
    id: "europe",
    name: "Europe",
    coordinates: [10, 50],
    color: "#ccebc5",
    audioSample: "/audio/europe.mp3",
    description: "Classical, folk, and electronic music from across the continent.",
    genres: ["Classical", "Folk", "EDM"],
    instruments: ["Violin", "Accordion", "Synthesizer"],
    languages: ["English", "French", "German", "Italian"],
    mood: ["Elegant", "Lively"],
    culture: "Rich musical heritage from medieval to modern times."
  },
  "africa": {
    id: "africa",
    name: "Africa",
    coordinates: [20, 0],
    color: "#decbe4",
    audioSample: "/audio/africa.mp3",
    description: "Polyrhythmic drumming, Afrobeat, and traditional music from all regions.",
    genres: ["Afrobeat", "Highlife", "Griot", "Traditional"],
    instruments: ["Djembe", "Kora", "Balafon"],
    languages: ["Swahili", "Arabic", "French", "Yoruba"],
    mood: ["Energetic", "Spiritual"],
    culture: "Music is woven into daily life, rituals, and celebrations."
  },
  "asia": {
    id: "asia",
    name: "Asia",
    coordinates: [100, 40],
    color: "#fed9a6",
    audioSample: "/audio/asia.mp3",
    description: "Traditional, pop, and fusion music from East, South, and Southeast Asia.",
    genres: ["K-Pop", "Bollywood", "Gamelan", "Folk"],
    instruments: ["Sitar", "Koto", "Erhu", "Guzheng"],
    languages: ["Mandarin", "Hindi", "Japanese", "Korean"],
    mood: ["Melodic", "Dramatic"],
    culture: "Music is diverse, reflecting ancient and modern influences."
  },
  "oceania": {
    id: "oceania",
    name: "Oceania",
    coordinates: [150, -25],
    color: "#ffffcc",
    audioSample: "/audio/oceania.mp3",
    description: "Indigenous, folk, and pop music from Australia, New Zealand, and Pacific Islands.",
    genres: ["Didgeridoo", "Haka", "Folk", "Pop"],
    instruments: ["Didgeridoo", "Ukulele", "Guitar"],
    languages: ["English", "Maori", "Tok Pisin"],
    mood: ["Earthy", "Joyful"],
    culture: "Music is tied to land, ancestry, and storytelling."
  },
  "antarctica": {
    id: "antarctica",
    name: "Antarctica",
    coordinates: [0, -90],
    color: "#d9d9d9",
    audioSample: "/audio/antarctica.mp3",
    description: "Experimental and ambient music inspired by the icy continent.",
    genres: ["Ambient", "Experimental"],
    instruments: ["Synthesizer", "Field Recording"],
    languages: ["None"],
    mood: ["Calm", "Mysterious"],
    culture: "Music here is inspired by nature and scientific exploration."
  }
};

const allGenres: string[] = [
  ...Array.from(new Set(Object.values(regionMap).flatMap((r: Region) => r.genres)))
];
const allInstruments: string[] = [
  ...Array.from(new Set(Object.values(regionMap).flatMap((r: Region) => r.instruments)))
];
const allLanguages: string[] = [
  ...Array.from(new Set(Object.values(regionMap).flatMap((r: Region) => r.languages)))
];
const allMoods: string[] = [
  ...Array.from(new Set(Object.values(regionMap).flatMap((r: Region) => r.mood)))
];

export default function ExplorePage() {
  const { theme, setTheme } = useThemeContext();
  const [userId, setUserId] = useState<string | null>(null);
  const db = typeof window !== "undefined" ? getFirestore() : null;
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [filters, setFilters] = useState({
    genre: [] as string[],
    instrument: [] as string[],
    language: [] as string[],
    mood: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "info">("map");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && db) {
        setUserId(user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.theme) setTheme(data.theme);
        }
      }
    });
    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    if (userId && db) {
      await setDoc(doc(db, "users", userId), { theme: newTheme }, { merge: true });
    }
  };

  // Screen size listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const currentFilters = [...prev[category]];
      const index = currentFilters.indexOf(value);
      
      if (index > -1) {
        currentFilters.splice(index, 1);
      } else {
        currentFilters.push(value);
      }
      
      return {
        ...prev,
        [category]: currentFilters
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      genre: [],
      instrument: [],
      language: [],
      mood: []
    });
  };

  const filteredRegions = Object.values(regionMap).filter((region: Region) => {
    return (
      (filters.genre.length === 0 || filters.genre.some((g: string) => region.genres.includes(g))) &&
      (filters.instrument.length === 0 || filters.instrument.some((i: string) => region.instruments.includes(i))) &&
      (filters.language.length === 0 || filters.language.some((l: string) => region.languages.includes(l))) &&
      (filters.mood.length === 0 || filters.mood.some((m: string) => region.mood.includes(m)))
    );
  });

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  };

  // Example: fetch tracks or regions if you want to make this dynamic
  const { data: tracksData, error: tracksError } = useSWR("/api/tracks", fetcher);
  // You can use tracksData to render dynamic content

  // Add click handler for SVG map
  useEffect(() => {
    const svg = document.getElementById("world-map") as SVGSVGElement | null;
    if (!svg) return;
    const handleMapClick = (e: MouseEvent) => {
      const target = e.target as SVGElement;
      const regionId = target.id;
      if (regionMap[regionId]) {
        setSelectedRegion(regionMap[regionId]);
        setIsPlaying(true);
        if (window.innerWidth < 1024) setMobileView("info");
      }
    };
    svg.addEventListener("click", handleMapClick);
    return () => svg.removeEventListener("click", handleMapClick);
  }, []);

  return (
    <>
      <NavBar theme={theme} />
      <div className={clsx(
        "min-h-screen font-sans antialiased transition-all duration-500",
        {
          "bg-gradient-to-br from-white to-gray-50 text-gray-900": theme === "light",
          "bg-gradient-to-br from-gray-900 to-gray-950 text-white": theme === "dark",
          "bg-gradient-to-br from-rose-50 to-amber-50 text-rose-900": theme === "pastel",
        }
      )}>
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Map Section - 2/3 width on large screens */}
            <div className={clsx(
              "lg:w-2/3 rounded-2xl overflow-hidden relative",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
                "hidden lg:block": mobileView !== "map",
                "block": mobileView === "map"
              }
            )}>
              {/* World Map Visualization */}
              <div className="h-[500px] lg:h-[calc(100vh-180px)] relative">
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  {/* Simplified world map representation */}
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-[url('/world-map.svg')] bg-contain bg-center bg-no-repeat opacity-30"></div>
                    
                    {/* Region markers */}
                    {filteredRegions.map((region: Region) => (
                      <button
                        key={region.id}
                        className={clsx(
                          "absolute w-8 h-8 rounded-full flex items-center justify-center transition-all transform hover:scale-110 focus:outline-none",
                          {
                            "ring-2 ring-offset-2": selectedRegion?.id === region.id,
                            "ring-blue-500 ring-offset-white": selectedRegion?.id === region.id && theme === "light",
                            "ring-indigo-500 ring-offset-gray-900": selectedRegion?.id === region.id && theme === "dark",
                            "ring-rose-500 ring-offset-rose-50": selectedRegion?.id === region.id && theme === "pastel",
                          }
                        )}
                        style={{
                          left: `calc(50% + ${region.coordinates[0] * 2}px)`,
                          top: `calc(50% - ${region.coordinates[1] * 2}px)`,
                          backgroundColor: region.color
                        }}
                        onClick={() => {
                          setSelectedRegion(region);
                          setIsPlaying(true);
                          if (window.innerWidth < 1024) {
                            setMobileView("info");
                          }
                        }}
                        aria-label={`Explore ${region.name} music`}
                      >
                        <Music className="w-4 h-4 text-white" />
                      </button>
                    ))}
                    
                    {/* Map legend */}
                    <div className={clsx(
                      "absolute bottom-4 left-4 p-4 rounded-xl backdrop-blur-sm",
                      {
                        "bg-white/80 border border-gray-200": theme === "light",
                        "bg-gray-800/80 border border-gray-700": theme === "dark",
                        "bg-white/80 border border-rose-200": theme === "pastel",
                      }
                    )}>
                      <h3 className="font-bold mb-2">Regions</h3>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(regionMap).map((region: Region) => (
                          <div key={region.id} className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: region.color }}
                            ></div>
                            <span className="text-sm">{region.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile view toggle button */}
              <button 
                className={clsx(
                  "lg:hidden absolute top-4 right-4 p-2 rounded-full",
                  {
                    "bg-white text-gray-900": theme === "light",
                    "bg-gray-800 text-white": theme === "dark",
                    "bg-white text-rose-900": theme === "pastel",
                  }
                )}
                onClick={() => setMobileView("info")}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
            
            {/* Info Panel - 1/3 width on large screens */}
            <div className={clsx(
              "lg:w-1/3 flex flex-col gap-6",
              {
                "hidden lg:flex": mobileView !== "info",
                "flex": mobileView === "info"
              }
            )}>
              {/* Mobile back button */}
              <button 
                className={clsx(
                  "lg:hidden flex items-center gap-2 mb-4 p-2 rounded-lg",
                  {
                    "bg-gray-100": theme === "light",
                    "bg-gray-800": theme === "dark",
                    "bg-rose-100": theme === "pastel",
                  }
                )}
                onClick={() => setMobileView("map")}
              >
                <ChevronUp className="w-5 h-5" />
                <span>Back to Map</span>
              </button>
              
              {/* Audio Preview Card */}
              <div className={clsx(
                "rounded-2xl overflow-hidden",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <div className={clsx(
                  "p-6 flex flex-col gap-4",
                  {
                    "bg-gradient-to-r from-blue-500 to-indigo-600 text-white": !selectedRegion && theme === "light",
                    "bg-gradient-to-r from-indigo-700 to-purple-800 text-white": !selectedRegion && theme === "dark",
                    "bg-gradient-to-r from-rose-500 to-amber-500 text-white": !selectedRegion && theme === "pastel",
                    "bg-gray-800 text-white": selectedRegion && theme === "dark",
                    "bg-white text-gray-900": selectedRegion && theme === "light",
                    "bg-rose-50 text-rose-900": selectedRegion && theme === "pastel",
                  }
                )}>
                  {selectedRegion ? (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-bold">{selectedRegion.name}</h2>
                          <p className="opacity-80 mt-1">{selectedRegion.description}</p>
                        </div>
                        <div 
                          className="w-14 h-14 rounded-lg flex-shrink-0 ml-4"
                          style={{ backgroundColor: selectedRegion.color }}
                        ></div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={togglePlay}
                              className={clsx(
                                "w-12 h-12 rounded-full flex items-center justify-center",
                                {
                                  "bg-blue-600 text-white": theme === "light",
                                  "bg-indigo-600 text-white": theme === "dark",
                                  "bg-rose-500 text-white": theme === "pastel",
                                }
                              )}
                            >
                              {isPlaying ? (
                                <Pause className="w-5 h-5 fill-current" />
                              ) : (
                                <Play className="w-5 h-5 fill-current" />
                              )}
                            </button>
                            <span className="font-medium">Sample Track</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4 opacity-70" />
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={volume}
                              onChange={(e) => setVolume(parseInt(e.target.value))}
                              className={clsx(
                                "w-24 accent-blue-500",
                                {
                                  "accent-blue-500": theme === "light",
                                  "accent-indigo-500": theme === "dark",
                                  "accent-rose-500": theme === "pastel",
                                }
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className={clsx(
                          "h-2 rounded-full overflow-hidden mt-1",
                          {
                            "bg-gray-200": theme === "light",
                            "bg-gray-700": theme === "dark",
                            "bg-rose-200": theme === "pastel",
                          }
                        )}>
                          <div 
                            className={clsx(
                              "h-full w-1/3",
                              {
                                "bg-blue-600": theme === "light",
                                "bg-indigo-500": theme === "dark",
                                "bg-rose-500": theme === "pastel",
                              }
                            )}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm mt-1 opacity-70">
                          <span>1:24</span>
                          <span>4:12</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 mx-auto mb-4 opacity-70" />
                      <h2 className="text-xl font-bold mb-2">Select a Region</h2>
                      <p>Click on a region marker to explore its musical heritage</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Culture Panel */}
              {selectedRegion && (
                <div className={clsx(
                  "rounded-2xl overflow-hidden",
                  {
                    "bg-white border border-gray-200": theme === "light",
                    "bg-gray-800 border border-gray-700": theme === "dark",
                    "bg-white border border-rose-200": theme === "pastel",
                  }
                )}>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Cultural Context</h3>
                    <p className="opacity-90 mb-4">{selectedRegion.culture}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Music className="w-4 h-4" /> Genres
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegion.genres.map((genre: string) => (
                            <span 
                              key={genre}
                              className={clsx(
                                "px-3 py-1 rounded-full text-sm",
                                {
                                  "bg-blue-100 text-blue-800": theme === "light",
                                  "bg-indigo-900/50 text-indigo-200": theme === "dark",
                                  "bg-rose-100 text-rose-800": theme === "pastel",
                                }
                              )}
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Headphones className="w-4 h-4" /> Instruments
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegion.instruments.map((instrument: string) => (
                            <span 
                              key={instrument}
                              className={clsx(
                                "px-3 py-1 rounded-full text-sm",
                                {
                                  "bg-green-100 text-green-800": theme === "light",
                                  "bg-emerald-900/50 text-emerald-200": theme === "dark",
                                  "bg-emerald-100 text-emerald-800": theme === "pastel",
                                }
                              )}
                            >
                              {instrument}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Mic2 className="w-4 h-4" /> Languages
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegion.languages.map((language: string) => (
                            <span 
                              key={language}
                              className={clsx(
                                "px-3 py-1 rounded-full text-sm",
                                {
                                  "bg-amber-100 text-amber-800": (theme === "light" || theme === "pastel"),
                                  "bg-amber-900/50 text-amber-200": theme === "dark",
                                }
                              )}
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold mb-2 flex items-center gap-2">
                          <Smile className="w-4 h-4" /> Mood
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegion.mood.map((m: string) => (
                            <span 
                              key={m}
                              className={clsx(
                                "px-3 py-1 rounded-full text-sm",
                                {
                                  "bg-purple-100 text-purple-800": (theme === "light" || theme === "pastel"),
                                  "bg-purple-900/50 text-purple-200": theme === "dark",
                                }
                              )}
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Filter Sidebar */}
              <div className={clsx(
                "rounded-2xl overflow-hidden",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Filter className="w-5 h-5" /> Filters
                    </h3>
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={clsx(
                        "p-2 rounded-lg",
                        {
                          "hover:bg-gray-100": theme === "light",
                          "hover:bg-gray-700": theme === "dark",
                          "hover:bg-rose-100": theme === "pastel",
                        }
                      )}
                    >
                      {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {(showFilters || isLargeScreen) && (
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Music className="w-4 h-4" /> Genre
                          </h4>
                          {filters.genre.length > 0 && (
                            <button 
                              onClick={() => setFilters(prev => ({ ...prev, genre: [] }))}
                              className="text-sm opacity-70 hover:opacity-100"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {allGenres.map((genre: string) => (
                            <button
                              key={genre}
                              onClick={() => toggleFilter("genre", genre)}
                              className={clsx(
                                "px-3 py-1 rounded-full text-sm transition-all",
                                {
                                  "bg-blue-100 text-blue-800": theme === "light" && filters.genre.includes(genre),
                                  "bg-gray-100 text-gray-800": theme === "light" && !filters.genre.includes(genre),
                                  "bg-indigo-900/50 text-indigo-200": theme === "dark" && filters.genre.includes(genre),
                                  "bg-gray-700 text-gray-300": theme === "dark" && !filters.genre.includes(genre),
                                  "bg-rose-100 text-rose-800": theme === "pastel" && filters.genre.includes(genre),
                                  "bg-rose-50 text-rose-700": theme === "pastel" && !filters.genre.includes(genre),
                                }
                              )}
                            >
                              {genre}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Headphones className="w-4 h-4" /> Instruments
                          </h4>
                          {filters.instrument.length > 0 && (
                            <button 
                              onClick={() => setFilters(prev => ({ ...prev, instrument: [] }))}
                              className="text-sm opacity-70 hover:opacity-100"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {allInstruments.map((instrument: string) => (
                            <button
                              key={instrument}
                              onClick={() => toggleFilter("instrument", instrument)}
                              className={clsx(
                                "px-3 py-1 rounded-full text-sm transition-all",
                                {
                                  "bg-green-100 text-green-800": theme === "light" && filters.instrument.includes(instrument),
                                  "bg-gray-100 text-gray-800": theme === "light" && !filters.instrument.includes(instrument),
                                  "bg-emerald-900/50 text-emerald-200": theme === "dark" && filters.instrument.includes(instrument),
                                  "bg-gray-700 text-gray-300": theme === "dark" && !filters.instrument.includes(instrument),
                                  "bg-emerald-100 text-emerald-800": theme === "pastel" && filters.instrument.includes(instrument),
                                  "bg-emerald-50 text-emerald-700": theme === "pastel" && !filters.instrument.includes(instrument),
                                }
                              )}
                            >
                              {instrument}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Mic2 className="w-4 h-4" /> Language
                          </h4>
                          {filters.language.length > 0 && (
                            <button 
                              onClick={() => setFilters(prev => ({ ...prev, language: [] }))}
                              className="text-sm opacity-70 hover:opacity-100"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {allLanguages.map((language: string) => (
                            <button
                              key={language}
                              onClick={() => toggleFilter("language", language)}
                              className={clsx(
                                "px-3 py-1 rounded-full text-sm transition-all",
                                {
                                  "bg-amber-100 text-amber-800": (theme === "light" || theme === "pastel") && filters.language.includes(language),
                                  "bg-gray-100 text-gray-800": theme === "light" && !filters.language.includes(language),
                                  "bg-amber-900/50 text-amber-200": theme === "dark" && filters.language.includes(language),
                                  "bg-gray-700 text-gray-300": theme === "dark" && !filters.language.includes(language),
                                  "bg-amber-50 text-amber-700": theme === "pastel" && !filters.language.includes(language),
                                }
                              )}
                            >
                              {language}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <Smile className="w-4 h-4" /> Mood
                          </h4>
                          {filters.mood.length > 0 && (
                            <button 
                              onClick={() => setFilters(prev => ({ ...prev, mood: [] }))}
                              className="text-sm opacity-70 hover:opacity-100"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {allMoods.map((mood: string) => (
                            <button
                              key={mood}
                              onClick={() => toggleFilter("mood", mood)}
                              className={clsx(
                                "px-3 py-1 rounded-full text-sm transition-all",
                                {
                                  "bg-purple-100 text-purple-800": (theme === "light" || theme === "pastel") && filters.mood.includes(mood),
                                  "bg-gray-100 text-gray-800": theme === "light" && !filters.mood.includes(mood),
                                  "bg-purple-900/50 text-purple-200": theme === "dark" && filters.mood.includes(mood),
                                  "bg-gray-700 text-gray-300": theme === "dark" && !filters.mood.includes(mood),
                                  "bg-purple-50 text-purple-700": theme === "pastel" && !filters.mood.includes(mood),
                                }
                              )}
                            >
                              {mood}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {(filters.genre.length > 0 || filters.instrument.length > 0 || 
                        filters.language.length > 0 || filters.mood.length > 0) && (
                        <button
                          onClick={clearFilters}
                          className={clsx(
                            "w-full py-2 rounded-lg font-medium flex items-center justify-center gap-2",
                            {
                              "bg-gray-800 text-white": theme === "light",
                              "bg-gray-700 text-white": theme === "dark",
                              "bg-rose-700 text-white": theme === "pastel",
                            }
                          )}
                        >
                          <X className="w-4 h-4" />
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}