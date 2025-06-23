// app/explore/page.tsx
'use client';

import { useState, useEffect } from "react";
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
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

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

const NavBar = ({ theme }: { theme: Theme }) => (
  <nav
    className={clsx(
      "w-full flex items-center justify-between px-6 py-3 rounded-2xl shadow-lg mt-4 mb-8 transition-all",
      {
        "bg-gradient-to-r from-blue-500 to-indigo-600 text-white": theme === "light",
        "bg-gradient-to-r from-gray-800 to-indigo-900 text-white": theme === "dark",
        "bg-gradient-to-r from-rose-500 to-amber-500 text-white": theme === "pastel",
      }
    )}
    style={{ backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.15)' }}
  >
    <a href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight hover:scale-105 transition-transform">
      <span className="inline-block bg-white/20 rounded-full p-2">
        <Music className="w-7 h-7" />
      </span>
      Sonara
    </a>
    <div className="flex gap-6 text-lg font-medium">
      <a href="/explore" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Explore</a>
      <a href="/library-curated_collections" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Library</a>
      <a href="/track_id-track_details" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Track ID</a>
      <a href="/about_page" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">About</a>
      <a href="/blog" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Blog</a>
    </div>
    <div className="flex items-center gap-4">
      <a href="#" className="px-5 py-2 rounded-full font-semibold bg-white/20 hover:bg-white/30 transition-all shadow text-white">Sign In</a>
      <a href="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
        </svg>
      </a>
    </div>
  </nav>
);

export default function ExplorePage() {
  const [theme, setTheme] = useState<Theme>("light");
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

  // Theme persistence logic
  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = window.localStorage.getItem("sonara-theme") as Theme | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.className = theme;
    window.localStorage.setItem("sonara-theme", theme);
  }, [theme]);

  // Screen size listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Sample data for regions
  const regions: Region[] = [
    {
      id: "west-africa",
      name: "West Africa",
      coordinates: [-1, 13],
      color: "#f59e0b",
      audioSample: "/samples/west-africa.mp3",
      description: "Home to complex polyrhythms and the talking drum. Features the kora, balafon, and djembe.",
      genres: ["Afrobeat", "Highlife", "Mbalax", "Jùjú"],
      instruments: ["Djembe", "Kora", "Talking Drum", "Balafon"],
      languages: ["Yoruba", "Hausa", "Fula", "Mandinka"],
      mood: ["Energetic", "Ceremonial", "Complex", "Danceable"],
      culture: "Music is deeply integrated into daily life, from storytelling to ceremonies. Griots preserve oral history through song."
    },
    {
      id: "andean",
      name: "Andean Region",
      coordinates: [-72, -13],
      color: "#10b981",
      audioSample: "/samples/andean.mp3",
      description: "Haunting melodies of the Andes mountains featuring panpipes and charango.",
      genres: ["Huayno", "Sikuri", "Yaraví", "Cueca"],
      instruments: ["Siku", "Charango", "Quena", "Bombo"],
      languages: ["Quechua", "Aymara", "Spanish"],
      mood: ["Melancholic", "Elevating", "Traditional", "Spiritual"],
      culture: "Music connects to the mountains and earth. Used in agricultural rituals and festivals like Inti Raymi."
    },
    {
      id: "balkans",
      name: "Balkans",
      coordinates: [21, 44],
      color: "#ef4444",
      audioSample: "/samples/balkans.mp3",
      description: "Complex rhythms and passionate melodies with influences from Ottoman, Slavic, and Romani traditions.",
      genres: ["Čoček", "Sevdalinka", "Tallava", "Balkan Brass"],
      instruments: ["Gusle", "Tamburica", "Gajda", "Tapan"],
      languages: ["Serbian", "Romani", "Albanian", "Bulgarian"],
      mood: ["Passionate", "Rhythmic", "Celebratory", "Expressive"],
      culture: "Music reflects turbulent history with themes of love and loss. Brass bands are central to celebrations."
    },
    {
      id: "indonesia",
      name: "Indonesia",
      coordinates: [118, -2],
      color: "#8b5cf6",
      audioSample: "/samples/gamelan.mp3",
      description: "Gamelan orchestras with metallic percussion and intricate interlocking patterns.",
      genres: ["Gamelan", "Keroncong", "Dangdut", "Jaipongan"],
      instruments: ["Gong", "Bonang", "Saron", "Gender", "Suling"],
      languages: ["Javanese", "Balinese", "Sundanese", "Indonesian"],
      mood: ["Hypnotic", "Ceremonial", "Meditative", "Complex"],
      culture: "Music accompanies rituals and dance. Balinese gamelan is dynamic while Javanese is more meditative."
    },
    {
      id: "caucasus",
      name: "Caucasus",
      coordinates: [44, 42],
      color: "#0ea5e9",
      audioSample: "/samples/caucasus.mp3",
      description: "Ancient polyphonic singing traditions with unique vocal techniques.",
      genres: ["Polyphonic Singing", "Mugham", "Ashig", "Lezginka"],
      instruments: ["Duduk", "Tar", "Kamancha", "Doli"],
      languages: ["Georgian", "Armenian", "Azeri", "Circassian"],
      mood: ["Ancient", "Harmonic", "Soulful", "Traditional"],
      culture: "Svaneti polyphony dates back 1000+ years. Music preserves endangered languages and traditions."
    }
  ];

  const allGenres = Array.from(new Set(regions.flatMap(r => r.genres)));
  const allInstruments = Array.from(new Set(regions.flatMap(r => r.instruments)));
  const allLanguages = Array.from(new Set(regions.flatMap(r => r.languages)));
  const allMoods = Array.from(new Set(regions.flatMap(r => r.mood)));

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

  const filteredRegions = regions.filter(region => {
    return (
      (filters.genre.length === 0 || filters.genre.some(g => region.genres.includes(g))) &&
      (filters.instrument.length === 0 || filters.instrument.some(i => region.instruments.includes(i))) &&
      (filters.language.length === 0 || filters.language.some(l => region.languages.includes(l))) &&
      (filters.mood.length === 0 || filters.mood.some(m => region.mood.includes(m)))
    );
  });

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  };

  return (
    <div className={clsx(
      "min-h-screen font-sans antialiased transition-colors duration-500",
      {
        "bg-gradient-to-b from-white to-gray-50 text-gray-900": theme === "light",
        "bg-gradient-to-b from-gray-900 to-gray-950 text-white": theme === "dark",
        "bg-gradient-to-b from-rose-50 to-amber-50 text-rose-900": theme === "pastel",
      }
    )}>
      <NavBar theme={theme} />
      {/* Header */}
      <header className={clsx(
        "sticky top-0 z-50 backdrop-blur-sm transition-all duration-500",
        {
          "bg-white/80 border-b border-gray-100": theme === "light",
          "bg-gray-900/80 border-b border-gray-800": theme === "dark",
          "bg-rose-50/80 border-b border-rose-200": theme === "pastel",
        }
      )}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              {
                "bg-blue-600 text-white": theme === "light",
                "bg-indigo-600 text-white": theme === "dark",
                "bg-rose-400 text-rose-900": theme === "pastel",
              }
            )}>
              <Globe className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Sonara</h1>
            <span className="ml-4 opacity-70">/ Explore</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2 p-1 rounded-full border">
              <button 
                onClick={() => setTheme("light")}
                className={clsx(
                  "p-2 rounded-full transition-all",
                  {
                    "bg-blue-100 text-blue-600": theme === "light",
                    "hover:bg-gray-100": theme === "light",
                    "hover:bg-gray-800": theme === "dark",
                    "hover:bg-rose-100": theme === "pastel",
                  }
                )}
                aria-label="Light theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setTheme("dark")}
                className={clsx(
                  "p-2 rounded-full transition-all",
                  {
                    "bg-indigo-600 text-white": theme === "dark",
                    "hover:bg-gray-100": theme === "light",
                    "hover:bg-gray-800": theme === "dark",
                    "hover:bg-rose-100": theme === "pastel",
                  }
                )}
                aria-label="Dark theme"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setTheme("pastel")}
                className={clsx(
                  "p-2 rounded-full transition-all",
                  {
                    "bg-rose-300 text-rose-800": theme === "pastel",
                    "hover:bg-gray-100": theme === "light",
                    "hover:bg-gray-800": theme === "dark",
                    "hover:bg-rose-100": theme === "pastel",
                  }
                )}
                aria-label="Pastel theme"
              >
                <Palette className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

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
                  {filteredRegions.map(region => (
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
                      {regions.map(region => (
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
                        {selectedRegion.genres.map(genre => (
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
                        {selectedRegion.instruments.map(instrument => (
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
                        {selectedRegion.languages.map(language => (
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
                        {selectedRegion.mood.map(m => (
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
                        {allGenres.map(genre => (
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
                        {allInstruments.map(instrument => (
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
                        {allLanguages.map(language => (
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
                        {allMoods.map(mood => (
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
  );
}