// app/library/page.tsx
'use client';

import { useState, useEffect } from "react";
import { 
  Filter, 
  ArrowDownWideNarrow, 
  Play, 
  Pause,
  Clock,
  Disc,
  Music,
  Album,
  History,
  Star,
  Loader,
  Search,
  Sun,
  Moon,
  Palette,
  X,
  Globe,
  ChevronRight
} from "lucide-react";
import clsx from "clsx";
import {auth} from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

type Theme = "light" | "dark" | "pastel";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

interface Collection {
  id: string;
  title: string;
  description: string;
  tracks: Track[];
  duration: string;
  theme: string;
  era: string;
  region: string;
  curator: string;
  curatorPick: boolean;
  coverColor: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function LibraryPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [userId, setUserId] = useState<string | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [filters, setFilters] = useState({
    theme: [] as string[],
    era: [] as string[],
    region: [] as string[],
    curatorPick: false
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [playingCollection, setPlayingCollection] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const db = typeof window !== "undefined" ? getFirestore() : null;

  const { data: collectionsData, error: collectionsError } = useSWR("/api/collections", fetcher);

  // Theme persistence logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("sonara-theme") as Theme | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("sonara-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (collectionsData && Array.isArray(collectionsData)) {
      setCollections(collectionsData);
      setFilteredCollections(collectionsData); // You may want to apply filters here
      setLoading(false);
    }
  }, [collectionsData]);

  useEffect(() => {
    filterAndSortCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collections, filters, sortBy, theme]);

  useEffect(() => {
    filterAndSortCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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

  const generateCollections = (): Collection[] => {
    return [
      {
        id: "amazon",
        title: "Sounds of the Amazon",
        description: "Indigenous music and rainforest soundscapes from the Amazon basin",
        tracks: [
          { id: "1", title: "River Dawn", artist: "Tribe of the Hummingbird", duration: "4:32" },
          { id: "2", title: "Jaguar Spirit", artist: "Amazon Drum Collective", duration: "3:45" },
          { id: "3", title: "Canopy Rain", artist: "Forest Voices", duration: "5:21" }
        ],
        duration: "45 min",
        theme: "Nature",
        era: "Traditional",
        region: "South America",
        curator: "Dr. Elena Silva",
        curatorPick: true,
        coverColor: "#10b981"
      },
      {
        id: "nordic-folk",
        title: "Nordic Folk Journeys",
        description: "Haunting melodies and folk traditions from Scandinavia",
        tracks: [
          { id: "1", title: "Fjord Echoes", artist: "Sven Olafsson", duration: "3:52" },
          { id: "2", title: "Northern Lights Waltz", artist: "Huldra Ensemble", duration: "4:18" },
          { id: "3", title: "Sami Yoik", artist: "Nils Johansen", duration: "5:07" }
        ],
        duration: "52 min",
        theme: "Folk",
        era: "Traditional",
        region: "Europe",
        curator: "Bjorn Andersson",
        curatorPick: true,
        coverColor: "#0ea5e9"
      },
      {
        id: "asian-fusion",
        title: "Asian Fusion Explorations",
        description: "Modern interpretations of traditional Asian instruments",
        tracks: [
          { id: "1", title: "Tokyo Rain", artist: "Koto Dreams", duration: "4:15" },
          { id: "2", title: "Himalayan Echo", artist: "Shangri-La Project", duration: "3:58" },
          { id: "3", title: "Gamelan Futurism", artist: "Bali 3000", duration: "5:32" }
        ],
        duration: "38 min",
        theme: "Fusion",
        era: "Contemporary",
        region: "Asia",
        curator: "Li Wei",
        curatorPick: true,
        coverColor: "#8b5cf6"
      },
      {
        id: "silk-road",
        title: "Silk Road Caravans",
        description: "Musical traditions along the ancient trade routes",
        tracks: [
          { id: "1", title: "Samarkand Bazaar", artist: "Uzbek Ensemble", duration: "3:45" },
          { id: "2", title: "Desert Oasis", artist: "Camel Caravan Group", duration: "4:22" },
          { id: "3", title: "Persian Night", artist: "Tehran Collective", duration: "5:11" }
        ],
        duration: "42 min",
        theme: "Historical",
        era: "Traditional",
        region: "Central Asia",
        curator: "Dr. Amir Khan",
        curatorPick: false,
        coverColor: "#f59e0b"
      },
      {
        id: "afro-futurism",
        title: "Afro-Futurism Odyssey",
        description: "African rhythms meet electronic soundscapes",
        tracks: [
          { id: "1", title: "Djembe Code", artist: "Digital Griots", duration: "4:08" },
          { id: "2", title: "Sahara Synth", artist: "Nomad Tech", duration: "3:51" },
          { id: "3", title: "Kora Waves", artist: "West Electric", duration: "5:19" }
        ],
        duration: "48 min",
        theme: "Fusion",
        era: "Contemporary",
        region: "Africa",
        curator: "Kwame Johnson",
        curatorPick: true,
        coverColor: "#ef4444"
      },
      {
        id: "oceanic",
        title: "Oceanic Harmonies",
        description: "Music from Pacific islands and coastal communities",
        tracks: [
          { id: "1", title: "Coral Chant", artist: "Polynesian Voices", duration: "3:37" },
          { id: "2", title: "Tide Drums", artist: "Melanesian Drummers", duration: "4:25" },
          { id: "3", title: "Wave Song", artist: "Island Echo", duration: "4:52" }
        ],
        duration: "41 min",
        theme: "Nature",
        era: "Traditional",
        region: "Oceania",
        curator: "Malia Chen",
        curatorPick: false,
        coverColor: "#06b6d4"
      },
      {
        id: "arctic",
        title: "Arctic Echoes",
        description: "Traditional songs from the far northern communities",
        tracks: [
          { id: "1", title: "Ice Melody", artist: "Inuit Throat Singers", duration: "4:15" },
          { id: "2", title: "Aurora Voices", artist: "Sami Ensemble", duration: "3:48" },
          { id: "3", title: "Tundra Rhythm", artist: "Siberian Collective", duration: "5:03" }
        ],
        duration: "39 min",
        theme: "Nature",
        era: "Traditional",
        region: "Arctic",
        curator: "Olaf Petersen",
        curatorPick: true,
        coverColor: "#3b82f6"
      },
      {
        id: "andean",
        title: "Andean Peaks",
        description: "Mountain music from the Andes region",
        tracks: [
          { id: "1", title: "Condor Flight", artist: "Quechua Musicians", duration: "4:22" },
          { id: "2", title: "Panpipe Valley", artist: "Bolivian Ensemble", duration: "3:57" },
          { id: "3", title: "Mountain Spirit", artist: "Peruvian Collective", duration: "5:14" }
        ],
        duration: "44 min",
        theme: "Folk",
        era: "Traditional",
        region: "South America",
        curator: "Carlos Mendez",
        curatorPick: false,
        coverColor: "#84cc16"
      }
    ];
  };

  const filterAndSortCollections = () => {
    let result = [...collections];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(collection => 
        collection.title.toLowerCase().includes(query) || 
        collection.description.toLowerCase().includes(query) ||
        collection.theme.toLowerCase().includes(query) ||
        collection.region.toLowerCase().includes(query)
      );
    }
    
    // Apply other filters
    if (filters.theme.length > 0) {
      result = result.filter(collection => filters.theme.includes(collection.theme));
    }
    
    if (filters.era.length > 0) {
      result = result.filter(collection => filters.era.includes(collection.era));
    }
    
    if (filters.region.length > 0) {
      result = result.filter(collection => filters.region.includes(collection.region));
    }
    
    if (filters.curatorPick) {
      result = result.filter(collection => collection.curatorPick);
    }
    
    // Apply sorting
    switch(sortBy) {
      case "newest":
        // In a real app, we'd sort by date added
        result = [...result].reverse();
        break;
      case "duration":
        result.sort((a, b) => {
          const aMins = parseInt(a.duration);
          const bMins = parseInt(b.duration);
          return bMins - aMins;
        });
        break;
      case "tracks":
        result.sort((a, b) => b.tracks.length - a.tracks.length);
        break;
      default:
        // Popular (curator picks first, then by title)
        result.sort((a, b) => {
          if (a.curatorPick && !b.curatorPick) return -1;
          if (!a.curatorPick && b.curatorPick) return 1;
          return a.title.localeCompare(b.title);
        });
    }
    
    // Pagination - show only first page*12 items
    const itemsPerPage = 8;
    const startIndex = 0;
    const endIndex = page * itemsPerPage;
    
    setFilteredCollections(result.slice(startIndex, endIndex));
    setHasMore(endIndex < result.length);
  };

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    if (category === "curatorPick") {
      setFilters(prev => ({ ...prev, curatorPick: !prev.curatorPick }));
      return;
    }
    
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
      theme: [],
      era: [],
      region: [],
      curatorPick: false
    });
    setSearchQuery("");
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const togglePlay = (collectionId: string) => {
    if (playingCollection === collectionId) {
      setPlayingCollection(null);
    } else {
      setPlayingCollection(collectionId);
    }
  };

  const getUniqueValues = (key: keyof Collection) => {
    return Array.from(new Set(collections.map(c => c[key] as string)));
  };

  const NavBar = ({ theme }: { theme: Theme }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAuthenticated(!!user);
      });
      return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
      await signOut(auth);
      router.push("/login");
    };

    return (
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
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight hover:scale-105 transition-transform">
          <span className="inline-block bg-white/20 rounded-full p-2">
            <Music className="w-7 h-7" />
          </span>
          Sonara
        </Link>
        <div className="flex gap-6 text-lg font-medium">
          <Link href="/explore" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Explore</Link>
          <Link href="/library-curated_collections" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Library</Link>
          <Link href="/track_id-track_details" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Track ID</Link>
          <Link href="/about_page" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">About</Link>
          <Link href="/blog" className="hover:underline underline-offset-8 decoration-2 decoration-white/60 transition-all">Blog</Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="px-5 py-2 rounded-full font-semibold bg-white/20 hover:bg-white/30 transition-all shadow text-white">Log Out</button>
          ) : (
            <Link href="/login" className="px-5 py-2 rounded-full font-semibold bg-white/20 hover:bg-white/30 transition-all shadow text-white">Sign In</Link>
          )}
          <Link href="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
            </svg>
          </Link>
        </div>
      </nav>
    );
  };

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    if (userId && db) {
      await setDoc(doc(db, "users", userId), { theme: newTheme }, { merge: true });
    }
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
              <Album className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Sonara</h1>
            <span className="ml-4 opacity-70">/ Library</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2 p-1 rounded-full border">
              <button 
                onClick={() => handleThemeChange("light")}
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
                onClick={() => handleThemeChange("dark")}
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
                onClick={() => handleThemeChange("pastel")}
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
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content - 3/4 width */}
          <div className="md:w-3/4">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className={clsx(
                "text-3xl md:text-4xl font-bold mb-2",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Curated Collections
              </h1>
              <p className={clsx(
                "text-lg",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-400": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Discover handpicked musical journeys from around the world
              </p>
            </div>
            
            {/* Controls Bar */}
            <div className={clsx(
              "flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8 p-4 rounded-xl",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
              }
            )}>
              {/* Search */}
              <div className={clsx(
                "relative w-full md:w-auto",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-400": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={clsx(
                    "pl-10 pr-4 py-2 rounded-lg w-full md:w-64",
                    {
                      "bg-gray-50 border border-gray-200": theme === "light",
                      "bg-gray-700 border border-gray-600": theme === "dark",
                      "bg-rose-50 border border-rose-200": theme === "pastel",
                    }
                  )}
                />
              </div>
              
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                {/* Sort Control */}
                <div className="flex items-center gap-2">
                  <ArrowDownWideNarrow className="w-4 h-4 opacity-70" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={clsx(
                      "py-2 pr-8 rounded-lg",
                      {
                        "bg-gray-50 border border-gray-200": theme === "light",
                        "bg-gray-700 border border-gray-600": theme === "dark",
                        "bg-rose-50 border border-rose-200": theme === "pastel",
                      }
                    )}
                  >
                    <option value="popular">Popular</option>
                    <option value="newest">Newest</option>
                    <option value="duration">Duration</option>
                    <option value="tracks">Most Tracks</option>
                  </select>
                </div>
                
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-lg",
                    {
                      "bg-gray-100": theme === "light" && !showFilters,
                      "bg-blue-100 text-blue-600": theme === "light" && showFilters,
                      "bg-gray-700": theme === "dark" && !showFilters,
                      "bg-indigo-600 text-white": theme === "dark" && showFilters,
                      "bg-rose-100": theme === "pastel" && !showFilters,
                      "bg-rose-300 text-rose-800": theme === "pastel" && showFilters,
                    }
                  )}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </button>
                
                {/* Clear Filters */}
                {(filters.theme.length > 0 || filters.era.length > 0 || 
                 filters.region.length > 0 || filters.curatorPick) && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Filters Panel */}
            {showFilters && (
              <div className={clsx(
                "mb-8 p-6 rounded-xl",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5" /> Filter Collections
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Theme Filter */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Disc className="w-4 h-4" /> Theme
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getUniqueValues("theme").map(themeValue => (
                        <button
                          key={themeValue}
                          onClick={() => toggleFilter("theme", themeValue)}
                          className={clsx(
                            "px-3 py-1 rounded-full text-sm transition-all",
                            {
                              "bg-blue-100 text-blue-800": theme === "light" && filters.theme.includes(themeValue),
                              "bg-gray-100 text-gray-800": theme === "light" && !filters.theme.includes(themeValue),
                              "bg-indigo-900/50 text-indigo-200": theme === "dark" && filters.theme.includes(themeValue),
                              "bg-gray-700 text-gray-300": theme === "dark" && !filters.theme.includes(themeValue),
                              "bg-rose-100 text-rose-800": theme === "pastel" && filters.theme.includes(themeValue),
                              "bg-rose-50 text-rose-700": theme === "pastel" && !filters.theme.includes(themeValue),
                            }
                          )}
                        >
                          {themeValue}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Era Filter */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <History className="w-4 h-4" /> Era
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getUniqueValues("era").map(era => (
                        <button
                          key={era}
                          onClick={() => toggleFilter("era", era)}
                          className={clsx(
                            "px-3 py-1 rounded-full text-sm transition-all",
                            {
                              "bg-green-100 text-green-800": theme === "light" && filters.era.includes(era),
                              "bg-gray-100 text-gray-800": theme === "light" && !filters.era.includes(era),
                              "bg-emerald-900/50 text-emerald-200": theme === "dark" && filters.era.includes(era),
                              "bg-gray-700 text-gray-300": theme === "dark" && !filters.era.includes(era),
                              "bg-emerald-100 text-emerald-800": theme === "pastel" && filters.era.includes(era),
                              "bg-emerald-50 text-emerald-700": theme === "pastel" && !filters.era.includes(era),
                            }
                          )}
                        >
                          {era}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Region Filter */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Region
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getUniqueValues("region").map(region => (
                        <button
                          key={region}
                          onClick={() => toggleFilter("region", region)}
                          className={clsx(
                            "px-3 py-1 rounded-full text-sm transition-all",
                            {
                              "bg-amber-100 text-amber-800": (theme === "light" || theme === "pastel") && filters.region.includes(region),
                              "bg-gray-100 text-gray-800": theme === "light" && !filters.region.includes(region),
                              "bg-amber-900/50 text-amber-200": theme === "dark" && filters.region.includes(region),
                              "bg-gray-700 text-gray-300": theme === "dark" && !filters.region.includes(region),
                              "bg-amber-50 text-amber-700": theme === "pastel" && !filters.region.includes(region),
                            }
                          )}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Curator Pick */}
                  <div className="md:col-span-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={filters.curatorPick}
                        onChange={() => toggleFilter("curatorPick", "")}
                        className={clsx(
                          "w-5 h-5 rounded focus:ring-0",
                          {
                            "text-blue-600": theme === "light",
                            "text-indigo-600": theme === "dark",
                            "text-rose-600": theme === "pastel",
                          }
                        )}
                      />
                      <span className="flex items-center gap-2 font-medium">
                        <Star className="w-4 h-4" />
                        Curator&apos;s Picks Only
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Collections Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className={clsx(
                "text-center py-16 rounded-xl",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No Collections Found</h3>
                <p className="opacity-75">Try adjusting your filters or search query</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCollections.map(collection => (
                    <div 
                      key={collection.id}
                      className={clsx(
                        "rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group",
                        {
                          "bg-white border border-gray-200 shadow-sm": theme === "light",
                          "bg-gray-800 border border-gray-700": theme === "dark",
                          "bg-white border border-rose-200": theme === "pastel",
                        }
                      )}
                    >
                      {/* Collection Cover */}
                      <div 
                        className="h-40 relative"
                        style={{ backgroundColor: collection.coverColor }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{collection.title}</h3>
                            <p className="text-white/80 text-sm">{collection.description}</p>
                          </div>
                        </div>
                        
                        {/* Play Button */}
                        <button
                          onClick={() => togglePlay(collection.id)}
                          className={clsx(
                            "absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all transform",
                            {
                              "bg-white text-gray-900": theme === "light" || theme === "pastel",
                              "bg-gray-900 text-white": theme === "dark",
                              "opacity-0 group-hover:opacity-100": playingCollection !== collection.id,
                              "opacity-100": playingCollection === collection.id,
                              "scale-90 group-hover:scale-100": playingCollection !== collection.id
                            }
                          )}
                        >
                          {playingCollection === collection.id ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current" />
                          )}
                        </button>
                        
                        {/* Curator Pick Badge */}
                        {collection.curatorPick && (
                          <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            <span>Curator Pick</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Collection Info */}
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Music className="w-4 h-4 opacity-70" />
                              <span>{collection.tracks.length} tracks</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 opacity-70" />
                              <span>{collection.duration}</span>
                            </div>
                          </div>
                          
                          <span className={clsx(
                            "text-xs px-2 py-1 rounded",
                            {
                              "bg-blue-100 text-blue-800": theme === "light",
                              "bg-indigo-900/50 text-indigo-200": theme === "dark",
                              "bg-rose-100 text-rose-800": theme === "pastel",
                            }
                          )}>
                            {collection.theme}
                          </span>
                        </div>
                        
                        {/* Tracks Preview */}
                        <div className="space-y-2">
                          {collection.tracks.slice(0, 3).map((track, index) => (
                            <div 
                              key={track.id}
                              className={clsx(
                                "flex items-center justify-between p-2 rounded-lg",
                                {
                                  "hover:bg-gray-100": theme === "light",
                                  "hover:bg-gray-700/50": theme === "dark",
                                  "hover:bg-rose-50": theme === "pastel",
                                }
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-5 text-center opacity-50">{index + 1}</span>
                                <div>
                                  <div className="font-medium">{track.title}</div>
                                  <div className="text-sm opacity-70">{track.artist}</div>
                                </div>
                              </div>
                              <span className="text-sm opacity-70">{track.duration}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t flex justify-between items-center">
                          <div className="text-sm opacity-80">
                            Curated by <span className="font-medium">{collection.curator}</span>
                          </div>
                          <button className={clsx(
                            "text-sm font-medium flex items-center gap-1",
                            {
                              "text-blue-600": theme === "light",
                              "text-indigo-400": theme === "dark",
                              "text-rose-600": theme === "pastel",
                            }
                          )}>
                            View All
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={loadMore}
                      className={clsx(
                        "px-6 py-3 rounded-lg font-medium",
                        {
                          "bg-gray-800 text-white hover:bg-gray-700": theme === "light",
                          "bg-gray-700 text-white hover:bg-gray-600": theme === "dark",
                          "bg-rose-700 text-white hover:bg-rose-600": theme === "pastel",
                        }
                      )}
                    >
                      Load More Collections
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar - 1/4 width */}
          <div className="md:w-1/4">
            {/* Top Picks */}
            <div className={clsx(
              "rounded-2xl overflow-hidden mb-6",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
              }
            )}>
              <div className={clsx(
                "p-5",
                {
                  "bg-gradient-to-r from-blue-500 to-indigo-600 text-white": theme === "light",
                  "bg-gradient-to-r from-indigo-700 to-purple-800 text-white": theme === "dark",
                  "bg-gradient-to-r from-rose-500 to-amber-500 text-white": theme === "pastel",
                }
              )}>
                <h3 className="text-xl font-bold mb-3">Editor&apos;s Picks</h3>
                <p className="opacity-90">Our favorite collections this month</p>
              </div>
              
              <div className="p-5">
                <div className="space-y-4">
                  {collections
                    .filter(c => c.curatorPick)
                    .slice(0, 3)
                    .map(collection => (
                      <div 
                        key={collection.id}
                        className="flex items-center gap-3 group cursor-pointer"
                        onClick={() => setPlayingCollection(collection.id === playingCollection ? null : collection.id)}
                      >
                        <div 
                          className="w-12 h-12 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: collection.coverColor }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold truncate">{collection.title}</h4>
                          <p className="text-sm opacity-70 truncate">{collection.curator}</p>
                        </div>
                        <button className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                          {
                            "bg-blue-100 text-blue-600": theme === "light",
                            "bg-indigo-900/50 text-indigo-300": theme === "dark",
                            "bg-rose-100 text-rose-600": theme === "pastel",
                          }
                        )}>
                          {playingCollection === collection.id ? (
                            <Pause className="w-3 h-3 fill-current" />
                          ) : (
                            <Play className="w-3 h-3 fill-current" />
                          )}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            {/* New Additions */}
            <div className={clsx(
              "rounded-2xl overflow-hidden",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
              }
            )}>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-3">Recently Added</h3>
                
                <div className="space-y-4">
                  {collections.slice(0, 3).map(collection => (
                    <div 
                      key={collection.id}
                      className="flex items-center gap-3 group cursor-pointer"
                      onClick={() => setPlayingCollection(collection.id === playingCollection ? null : collection.id)}
                    >
                      <div 
                        className="w-10 h-10 rounded flex-shrink-0"
                        style={{ backgroundColor: collection.coverColor }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{collection.title}</h4>
                        <p className="text-sm opacity-70 truncate">{collection.region}</p>
                      </div>
                      <button className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                        {
                          "bg-blue-100 text-blue-600": theme === "light",
                          "bg-indigo-900/50 text-indigo-300": theme === "dark",
                          "bg-rose-100 text-rose-600": theme === "pastel",
                        }
                      )}>
                        {playingCollection === collection.id ? (
                          <Pause className="w-3 h-3 fill-current" />
                        ) : (
                          <Play className="w-3 h-3 fill-current" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}