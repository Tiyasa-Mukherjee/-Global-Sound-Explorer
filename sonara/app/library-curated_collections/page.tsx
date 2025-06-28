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
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import ThemeToggle from "../../components/ThemeToggle";
import LoginButton from "../../components/LoginButton";
import { useThemeContext } from "../../components/ThemeContext";
import NavBar from "../../components/NavBar";

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
  const { theme } = useThemeContext();
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
        <div className="container mx-auto px-4 py-8">
          {/* Library Title */}
          <div className="flex items-center gap-4 mb-10">
            <div className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
              {
                "bg-blue-600 text-white": theme === "light",
                "bg-indigo-600 text-white": theme === "dark",
                "bg-rose-400 text-rose-900": theme === "pastel",
              }
            )}>
              <Music className="w-7 h-7" />
            </div>
            <h1 className={clsx(
              "text-3xl md:text-4xl font-bold tracking-tight drop-shadow-sm",
              {
                "text-gray-900": theme === "light",
                "text-white": theme === "dark",
                "text-rose-900": theme === "pastel",
              }
            )}>
              My Saved Collections
            </h1>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="flex-1 min-w-[300px]">
              <input 
                type="text" 
                placeholder="Search collections..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={clsx(
                  "w-full p-4 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-sm",
                  {
                    "bg-white text-gray-900 border-gray-300": theme === "light",
                    "bg-gray-800 text-white border-gray-700": theme === "dark",
                    "bg-rose-50 text-rose-900 border-rose-200": theme === "pastel",
                  }
                )}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={clsx(
                "px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow-sm",
                {
                  "bg-blue-600 text-white hover:bg-blue-700": theme === "light",
                  "bg-indigo-600 text-white hover:bg-indigo-700": theme === "dark",
                  "bg-rose-400 text-rose-900 hover:bg-rose-500": theme === "pastel",
                }
              )}
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronRight className={clsx("w-4 h-4 transition-transform", { "rotate-90": showFilters })} />
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className={clsx(
              "rounded-xl shadow-lg p-6 mb-8 border",
              {
                "bg-white border-gray-200": theme === "light",
                "bg-gray-900 border-gray-700": theme === "dark",
                "bg-rose-50 border-rose-200": theme === "pastel",
              }
            )}>
              <h2 className={clsx(
                "text-lg font-semibold mb-4",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>Filters</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Theme</label>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueValues("theme").map(value => (
                      <button 
                        key={value} 
                        onClick={() => toggleFilter("theme", value)}
                        className={clsx(
                          "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300",
                          {
                            "bg-blue-600 text-white": filters.theme.includes(value) && theme === "light",
                            "bg-indigo-600 text-white": filters.theme.includes(value) && theme === "dark",
                            "bg-rose-400 text-rose-900": filters.theme.includes(value) && theme === "pastel",
                            "bg-gray-200 text-gray-900": !filters.theme.includes(value) && theme === "light",
                            "bg-gray-700 text-white": !filters.theme.includes(value) && theme === "dark",
                            "bg-rose-100 text-rose-900": !filters.theme.includes(value) && theme === "pastel",
                          }
                        )}>
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Era</label>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueValues("era").map(value => (
                      <button 
                        key={value} 
                        onClick={() => toggleFilter("era", value)}
                        className={clsx(
                          "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300",
                          {
                            "bg-blue-600 text-white": filters.era.includes(value) && theme === "light",
                            "bg-indigo-600 text-white": filters.era.includes(value) && theme === "dark",
                            "bg-rose-400 text-rose-900": filters.era.includes(value) && theme === "pastel",
                            "bg-gray-200 text-gray-900": !filters.era.includes(value) && theme === "light",
                            "bg-gray-700 text-white": !filters.era.includes(value) && theme === "dark",
                            "bg-rose-100 text-rose-900": !filters.era.includes(value) && theme === "pastel",
                          }
                        )}>
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Region</label>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueValues("region").map(value => (
                      <button 
                        key={value} 
                        onClick={() => toggleFilter("region", value)}
                        className={clsx(
                          "px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300",
                          {
                            "bg-blue-600 text-white": filters.region.includes(value) && theme === "light",
                            "bg-indigo-600 text-white": filters.region.includes(value) && theme === "dark",
                            "bg-rose-400 text-rose-900": filters.region.includes(value) && theme === "pastel",
                            "bg-gray-200 text-gray-900": !filters.region.includes(value) && theme === "light",
                            "bg-gray-700 text-white": !filters.region.includes(value) && theme === "dark",
                            "bg-rose-100 text-rose-900": !filters.region.includes(value) && theme === "pastel",
                          }
                        )}>
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="curatorPick" 
                      checked={filters.curatorPick}
                      onChange={() => toggleFilter("curatorPick", "")}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
                    />
                    <label htmlFor="curatorPick" className="text-sm font-medium">Curator Picks Only</label>
                  </div>
                </div>
              </div>
              <button
                onClick={clearFilters}
                className={clsx(
                  "mt-4 px-4 py-2 rounded-lg font-medium transition-all duration-300",
                  {
                    "bg-gray-100 text-gray-900 hover:bg-gray-200": theme === "light",
                    "bg-gray-800 text-white hover:bg-gray-700": theme === "dark",
                    "bg-rose-100 text-rose-900 hover:bg-rose-200": theme === "pastel",
                  }
                )}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Collections Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCollections.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-lg text-gray-500">No collections found.</p>
                </div>
              ) : (
                filteredCollections.map(collection => (
                  <div 
                    key={collection.id} 
                    className={clsx(
                      "rounded-2xl shadow-lg overflow-hidden transition-transform transform hover:scale-[1.03] border flex flex-col h-full",
                      {
                        "bg-white border-gray-200": theme === "light",
                        "bg-gray-900 border-gray-700": theme === "dark",
                        "bg-rose-50 border-rose-200": theme === "pastel",
                      }
                    )}
                  >
                    <div className="relative h-40 w-full flex items-end justify-end" style={{ background: `linear-gradient(135deg, ${collection.coverColor} 60%, #fff0 100%)` }}>
                      <div className="absolute left-0 top-0 w-full h-full opacity-20" style={{ background: collection.coverColor }} />
                      <div className="absolute right-2 top-2 flex gap-2">
                        {collection.curatorPick && (
                          <span className={clsx(
                            "px-3 py-1 rounded-full text-xs font-bold shadow",
                            {
                              "bg-blue-600 text-white": theme === "light",
                              "bg-indigo-600 text-white": theme === "dark",
                              "bg-rose-400 text-rose-900": theme === "pastel",
                            }
                          )}>
                            Curator Pick
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className={clsx(
                        "text-lg font-bold mb-1 truncate",
                        {
                          "text-gray-900": theme === "light",
                          "text-white": theme === "dark",
                          "text-rose-900": theme === "pastel",
                        }
                      )}>{collection.title}</h3>
                      <p className={clsx(
                        "text-sm mb-2 line-clamp-2",
                        {
                          "text-gray-600": theme === "light",
                          "text-gray-400": theme === "dark",
                          "text-rose-700": theme === "pastel",
                        }
                      )}>{collection.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={clsx(
                          "text-xs rounded-full px-2 py-1 font-medium",
                          {
                            "bg-blue-100 text-blue-800": theme === "light",
                            "bg-indigo-900/50 text-indigo-200": theme === "dark",
                            "bg-rose-100 text-rose-800": theme === "pastel",
                          }
                        )}>{collection.theme}</span>
                        <span className={clsx(
                          "text-xs rounded-full px-2 py-1 font-medium",
                          {
                            "bg-gray-200 text-gray-900": theme === "light",
                            "bg-gray-700 text-white": theme === "dark",
                            "bg-rose-200 text-rose-900": theme === "pastel",
                          }
                        )}>{collection.era}</span>
                        <span className={clsx(
                          "text-xs rounded-full px-2 py-1 font-medium",
                          {
                            "bg-green-100 text-green-800": theme === "light",
                            "bg-green-900/50 text-green-200": theme === "dark",
                            "bg-green-100 text-green-900": theme === "pastel",
                          }
                        )}>{collection.region}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-auto">
                        <button 
                          onClick={() => togglePlay(collection.id)} 
                          className={clsx(
                            "p-2 rounded-full transition-all duration-300 shadow",
                            {
                              "bg-blue-600 text-white hover:bg-blue-700": theme === "light",
                              "bg-indigo-600 text-white hover:bg-indigo-700": theme === "dark",
                              "bg-rose-400 text-rose-900 hover:bg-rose-500": theme === "pastel",
                            }
                          )}
                        >
                          {playingCollection === collection.id ? (
                            <Pause className="w-5 h-5" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                        </button>
                        <Link 
                          href={`/collection/${collection.id}`} 
                          className={clsx(
                            "text-xs rounded-full px-3 py-1 font-medium transition-all duration-300 shadow",
                            {
                              "bg-blue-600 text-white hover:bg-blue-700": theme === "light",
                              "bg-indigo-600 text-white hover:bg-indigo-700": theme === "dark",
                              "bg-rose-400 text-rose-900 hover:bg-rose-500": theme === "pastel",
                            }
                          )}
                        >
                          View Collection
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={loadMore} 
                className={clsx(
                  "px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 shadow",
                  {
                    "bg-blue-600 text-white hover:bg-blue-700": theme === "light",
                    "bg-indigo-600 text-white hover:bg-indigo-700": theme === "dark",
                    "bg-rose-400 text-rose-900 hover:bg-rose-500": theme === "pastel",
                  }
                )}
              >
                <Loader className="w-5 h-5 animate-spin" />
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}