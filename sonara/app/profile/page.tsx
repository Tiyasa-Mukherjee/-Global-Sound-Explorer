// app/profile/page.tsx
'use client';

import { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  History, 
  Headphones, 
  Album, 
  Play, 
  Pause,
  ChevronRight,
  Clock,
  Globe,
  Volume2,
  Download,
  Bookmark,
  Moon,
  Sun,
  Palette,
  Heart // <-- Added Heart icon
} from "lucide-react";
import clsx from "clsx";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import type { User as FirebaseUser } from "firebase/auth";
import Image from "next/image";
import useSWR from "swr";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import ThemeToggle from "../../components/ThemeToggle";
import LoginButton from "../../components/LoginButton";
import { useThemeContext } from "../../components/ThemeContext";
import NavBar from "../../components/NavBar";

type Theme = "light" | "dark" | "pastel";
type Language = "en" | "es" | "fr" | "de";
type AudioQuality = "low" | "medium" | "high";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  region: string;
  playedAt: string;
}

interface Collection {
  id: string;
  title: string;
  tracks: number;
  duration: string;
  region: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProfilePage() {
  const { theme, setTheme } = useThemeContext();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"library" | "history" | "preferences">("library");
  const [audioQuality, setAudioQuality] = useState<AudioQuality>("high");
  const [language, setLanguage] = useState<Language>("en");
  const [volume, setVolume] = useState(85);
  const [downloading, setDownloading] = useState(false);
  const [savedTracks, setSavedTracks] = useState<Track[]>([]);
  const [savedCollections, setSavedCollections] = useState<Collection[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null); // <-- Added user state
  const router = useRouter();
  const db = typeof window !== "undefined" ? getFirestore() : null;

  // Remove simulated loading and use SWR for dynamic data
  const { data: tracksData } = useSWR("/api/tracks", fetcher);
  const { data: collectionsData } = useSWR("/api/collections", fetcher);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && db) {
        setUserId(user.uid);
        setUser(user); // <-- set user for profile display
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.theme) setTheme(data.theme);
        }
      }
    });
    return () => unsubscribe();
  }, [db, setTheme]);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
    if (tracksData && Array.isArray(tracksData)) {
      setSavedTracks(tracksData);
      setHistory(tracksData.slice(0, 4)); // Example: use first 4 as history
    }
    if (collectionsData && Array.isArray(collectionsData)) {
      setSavedCollections(collectionsData);
    }
  }, [tracksData, collectionsData]);

  const togglePlay = (trackId: string) => {
    if (playingTrack === trackId) {
      setPlayingTrack(null);
    } else {
      setPlayingTrack(trackId);
    }
  };

  const handleDownload = (trackId: string) => {
  setDownloading(true);
  // Simulate download
  setTimeout(() => {
    setDownloading(false);
    // Use trackId in the alert message to fix the error
    alert(`Track ${trackId} downloaded successfully!`);
  }, 1500);
};

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  const handleThemeChange = async (newTheme: Theme) => {
    setTheme(newTheme);
    if (userId && db) {
      await setDoc(doc(db, "users", userId), { theme: newTheme }, { merge: true });
    }
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
                <Headphones className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="/explore" className="font-medium hover:opacity-80 transition-opacity">Explore</a>
              <a href="/library-curated_collections" className="font-medium hover:opacity-80 transition-opacity">Library</a>
              <a href="/track_id-track_details" className="font-medium hover:opacity-80 transition-opacity">Track ID</a>
              <a href="/about_page" className="font-medium hover:opacity-80 transition-opacity">About</a>
            </nav>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LoginButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - 1/4 width */}
            <div className="lg:w-1/4">
              <div className={clsx(
                "rounded-2xl overflow-hidden mb-6",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <div className="p-6">
                  
                  
                  <div className="flex flex-col items-center text-center mb-6">
                    <Image
                      src={user?.photoURL || (user?.providerData && user?.providerData[0]?.photoURL) || "/default-profile.png"}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full border-2 border-blue-500 bg-gray-100 object-cover mb-4"
                      referrerPolicy="no-referrer"
                    />
                    <h2 className="text-xl font-bold mb-1">{user?.displayName || user?.providerData?.[0]?.displayName || user?.email || "User"}</h2>
                    <p className={clsx(
                      "opacity-70",
                      {
                        "text-gray-600": theme === "light",
                        "text-gray-400": theme === "dark",
                        "text-rose-700": theme === "pastel",
                      }
                    )}>
                      Explorer Member
                    </p>
                    <div className="mt-3 flex gap-2">
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-sm",
                        {
                          "bg-blue-100 text-blue-800": theme === "light",
                          "bg-indigo-900/50 text-indigo-200": theme === "dark",
                          "bg-rose-100 text-rose-800": theme === "pastel",
                        }
                      )}>
                        42 Tracks
                      </span>
                      <span className={clsx(
                        "px-3 py-1 rounded-full text-sm",
                        {
                          "bg-green-100 text-green-800": theme === "light",
                          "bg-emerald-900/50 text-emerald-200": theme === "dark",
                          "bg-emerald-100 text-emerald-800": theme === "pastel",
                        }
                      )}>
                        8 Collections
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveTab("library")}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        {
                          "bg-blue-100 text-blue-800 font-medium": activeTab === "library" && theme === "light",
                          "bg-indigo-900/50 text-indigo-200 font-medium": activeTab === "library" && theme === "dark",
                          "bg-rose-100 text-rose-800 font-medium": activeTab === "library" && theme === "pastel",
                          "hover:bg-gray-100": theme === "light" && activeTab !== "library",
                          "hover:bg-gray-700/50": theme === "dark" && activeTab !== "library",
                          "hover:bg-rose-50": theme === "pastel" && activeTab !== "library",
                        }
                      )}
                    >
                      <Bookmark className="w-5 h-5" />
                      <span>My Library</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("history")}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        {
                          "bg-blue-100 text-blue-800 font-medium": activeTab === "history" && theme === "light",
                          "bg-indigo-900/50 text-indigo-200 font-medium": activeTab === "history" && theme === "dark",
                          "bg-rose-100 text-rose-800 font-medium": activeTab === "history" && theme === "pastel",
                          "hover:bg-gray-100": theme === "light" && activeTab !== "history",
                          "hover:bg-gray-700/50": theme === "dark" && activeTab !== "history",
                          "hover:bg-rose-50": theme === "pastel" && activeTab !== "history",
                        }
                      )}
                    >
                      <History className="w-5 h-5" />
                      <span>Listening History</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("preferences")}
                      className={clsx(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                        {
                          "bg-blue-100 text-blue-800 font-medium": activeTab === "preferences" && theme === "light",
                          "bg-indigo-900/50 text-indigo-200 font-medium": activeTab === "preferences" && theme === "dark",
                          "bg-rose-100 text-rose-800 font-medium": activeTab === "preferences" && theme === "pastel",
                          "hover:bg-gray-100": theme === "light" && activeTab !== "preferences",
                          "hover:bg-gray-700/50": theme === "dark" && activeTab !== "preferences",
                          "hover:bg-rose-50": theme === "pastel" && activeTab !== "preferences",
                        }
                      )}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Preferences</span>
                    </button>
                  </div>
                  
                  {user && (
                    <button
                      onClick={handleSignOut}
                      className="ml-4 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
              
              {/* Download Queue */}
              <div className={clsx(
                "rounded-2xl overflow-hidden",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" /> Download Queue
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { title: "Amazon Field Recordings", progress: 75 },
                      { title: "Nordic Folk Collection", progress: 40 },
                      { title: "African Rhythms Pack", progress: 100 }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium truncate">{item.title}</span>
                          <span className="text-sm opacity-70">{item.progress}%</span>
                        </div>
                        <div className={clsx(
                          "h-2 rounded-full overflow-hidden",
                          {
                            "bg-gray-200": theme === "light",
                            "bg-gray-700": theme === "dark",
                            "bg-rose-200": theme === "pastel",
                          }
                        )}>
                          <div 
                            className={clsx(
                              "h-full",
                              {
                                "bg-blue-600": theme === "light",
                                "bg-indigo-500": theme === "dark",
                                "bg-rose-500": theme === "pastel",
                              }
                            )}
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Content - 3/4 width */}
            <div className="lg:w-3/4">
              {activeTab === "library" && (
                <>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className={clsx(
                      "text-2xl font-bold",
                      {
                        "text-gray-900": theme === "light",
                        "text-white": theme === "dark",
                        "text-rose-900": theme === "pastel",
                      }
                    )}>
                      My Library
                    </h2>
                    <div className="flex gap-2">
                      <button className={clsx(
                        "px-4 py-2 rounded-lg flex items-center gap-2",
                        {
                          "bg-gray-100": theme === "light",
                          "bg-gray-800": theme === "dark",
                          "bg-rose-100": theme === "pastel",
                        }
                      )}>
                        <span>Sort by</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Saved Tracks */}
                  <div className="mb-10">
                    <h3 className={clsx(
                      "text-lg font-bold mb-4 flex items-center gap-2",
                      {
                        "text-gray-900": theme === "light",
                        "text-white": theme === "dark",
                        "text-rose-900": theme === "pastel",
                      }
                    )}>
                      <Headphones className="w-5 h-5" /> Saved Tracks
                    </h3>
                    
                    <div className={clsx(
                      "rounded-2xl overflow-hidden",
                      {
                        "bg-white border border-gray-200": theme === "light",
                        "bg-gray-800 border border-gray-700": theme === "dark",
                        "bg-white border border-rose-200": theme === "pastel",
                      }
                    )}>
                      {savedTracks.length === 0 ? (
                        <div className="p-10 text-center">
                          <Headphones className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <h4 className="text-lg font-bold mb-2">No Saved Tracks</h4>
                          <p className="opacity-75">Start saving tracks to build your personal library</p>
                        </div>
                      ) : (
                        <div className="divide-y">
                          {savedTracks.map(track => (
                            <div 
                              key={track.id}
                              className="flex items-center justify-between p-4 group"
                            >
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => togglePlay(track.id)}
                                  className={clsx(
                                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                                    {
                                      "bg-blue-600 text-white": theme === "light",
                                      "bg-indigo-600 text-white": theme === "dark",
                                      "bg-rose-500 text-white": theme === "pastel",
                                    }
                                  )}
                                >
                                  {playingTrack === track.id ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                  ) : (
                                    <Play className="w-4 h-4 fill-current" />
                                  )}
                                </button>
                                
                                <div className="min-w-0">
                                  <h4 className="font-bold truncate">{track.title}</h4>
                                  <p className={clsx(
                                    "truncate text-sm",
                                    {
                                      "text-gray-600": theme === "light",
                                      "text-gray-400": theme === "dark",
                                      "text-rose-700": theme === "pastel",
                                    }
                                  )}>
                                    {track.artist} • {track.region}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                <span className={clsx(
                                  "text-sm",
                                  {
                                    "text-gray-500": theme === "light" || theme === "dark",
                                    "text-rose-600": theme === "pastel",
                                  }
                                )}>
                                  {track.duration}
                                </span>
                                
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleDownload(track.id)}
                                    className={clsx(
                                      "p-2 rounded-full",
                                      {
                                        "hover:bg-gray-100": theme === "light",
                                        "hover:bg-gray-700": theme === "dark",
                                        "hover:bg-rose-100": theme === "pastel",
                                      }
                                    )}
                                    disabled={downloading}
                                  >
                                    {downloading ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                                    ) : (
                                      <Download className="w-4 h-4" />
                                    )}
                                  </button>
                                  
                                  <button className={clsx(
                                    "p-2 rounded-full",
                                    {
                                      "text-red-500 hover:bg-red-50": theme === "light",
                                      "text-red-400 hover:bg-red-900/20": theme === "dark",
                                      "text-red-600 hover:bg-red-100": theme === "pastel",
                                    }
                                  )}>
                                    <Heart className="w-4 h-4 fill-current" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Saved Collections */}
                  <div>
                    <h3 className={clsx(
                      "text-lg font-bold mb-4 flex items-center gap-2",
                      {
                        "text-gray-900": theme === "light",
                        "text-white": theme === "dark",
                        "text-rose-900": theme === "pastel",
                      }
                    )}>
                      <Album className="w-5 h-5" /> Saved Collections
                    </h3>
                    
                    {savedCollections.length === 0 ? (
                      <div className={clsx(
                        "rounded-2xl p-10 text-center",
                        {
                          "bg-white border border-gray-200": theme === "light",
                          "bg-gray-800 border border-gray-700": theme === "dark",
                          "bg-white border border-rose-200": theme === "pastel",
                        }
                      )}>
                        <Album className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h4 className="text-lg font-bold mb-2">No Collections Saved</h4>
                        <p className="opacity-75">Save collections to access them anytime</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {savedCollections.map(collection => (
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
                            <div className="bg-gray-200 border-2 border-dashed h-40" />
                            <div className="p-5">
                              <h4 className="font-bold mb-2 truncate">{collection.title}</h4>
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Headphones className="w-4 h-4 opacity-70" />
                                  <span>{collection.tracks} tracks</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 opacity-70" />
                                  <span>{collection.duration}</span>
                                </div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={clsx(
                                  "text-sm",
                                  {
                                    "text-gray-600": theme === "light",
                                    "text-gray-400": theme === "dark",
                                    "text-rose-700": theme === "pastel",
                                  }
                                )}>
                                  {collection.region}
                                </span>
                                <button className={clsx(
                                  "flex items-center gap-1 text-sm font-medium group",
                                  {
                                    "text-blue-600": theme === "light",
                                    "text-indigo-400": theme === "dark",
                                    "text-rose-600": theme === "pastel",
                                  }
                                )}>
                                  Explore
                                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
              
              {activeTab === "history" && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className={clsx(
                      "text-2xl font-bold",
                      {
                        "text-gray-900": theme === "light",
                        "text-white": theme === "dark",
                        "text-rose-900": theme === "pastel",
                      }
                    )}>
                      Listening History
                    </h2>
                    <button className={clsx(
                      "px-4 py-2 rounded-lg",
                      {
                        "bg-gray-100 hover:bg-gray-200": theme === "light",
                        "bg-gray-800 hover:bg-gray-700": theme === "dark",
                        "bg-rose-100 hover:bg-rose-200": theme === "pastel",
                      }
                    )}>
                      Clear History
                    </button>
                  </div>
                  
                  <div className={clsx(
                    "rounded-2xl overflow-hidden",
                    {
                      "bg-white border border-gray-200": theme === "light",
                      "bg-gray-800 border border-gray-700": theme === "dark",
                      "bg-white border border-rose-200": theme === "pastel",
                    }
                  )}>
                    {history.length === 0 ? (
                      <div className="p-10 text-center">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h4 className="text-lg font-bold mb-2">No Listening History</h4>
                        <p className="opacity-75">Your listening history will appear here</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {history.map(track => (
                          <div 
                            key={track.id}
                            className="flex items-center justify-between p-4 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-gray-200 border-2 border-dashed rounded w-12 h-12 flex-shrink-0" />
                              
                              <div className="min-w-0">
                                <h4 className="font-bold truncate">{track.title}</h4>
                                <p className={clsx(
                                  "truncate text-sm",
                                  {
                                    "text-gray-600": theme === "light",
                                    "text-gray-400": theme === "dark",
                                    "text-rose-700": theme === "pastel",
                                  }
                                )}>
                                  {track.artist} • {track.region}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className={clsx(
                                  "text-sm",
                                  {
                                    "text-gray-500": theme === "light" || theme === "dark",
                                    "text-rose-600": theme === "pastel",
                                  }
                                )}>
                                  {track.playedAt}
                                </div>
                                <div className={clsx(
                                  "text-sm",
                                  {
                                    "text-gray-500": theme === "light" || theme === "dark",
                                    "text-rose-600": theme === "pastel",
                                  }
                                )}>
                                  {track.duration}
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => togglePlay(track.id)}
                                className={clsx(
                                  "w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                  {
                                    "bg-blue-100 text-blue-600": theme === "light",
                                    "bg-indigo-900/50 text-indigo-300": theme === "dark",
                                    "bg-rose-100 text-rose-600": theme === "pastel",
                                  }
                                )}
                              >
                                {playingTrack === track.id ? (
                                  <Pause className="w-4 h-4 fill-current" />
                                ) : (
                                  <Play className="w-4 h-4 fill-current" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === "preferences" && (
                <div>
                  <h2 className={clsx(
                    "text-2xl font-bold mb-8",
                    {
                      "text-gray-900": theme === "light",
                      "text-white": theme === "dark",
                      "text-rose-900": theme === "pastel",
                    }
                  )}>
                    Preferences
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Theme Preferences */}
                    <div className={clsx(
                      "rounded-2xl p-6",
                      {
                        "bg-white border border-gray-200": theme === "light",
                        "bg-gray-800 border border-gray-700": theme === "dark",
                        "bg-white border border-rose-200": theme === "pastel",
                      }
                    )}>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Palette className="w-5 h-5" /> Theme Preferences
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">App Theme</h4>
                          <div className="flex gap-4">
                            {[
                              { id: "light", name: "Light", icon: <Sun className="w-5 h-5" /> },
                              { id: "dark", name: "Dark", icon: <Moon className="w-5 h-5" /> },
                              { id: "pastel", name: "Pastel", icon: <Palette className="w-5 h-5" /> }
                            ].map(themeOption => (
                              <button
                                key={themeOption.id}
                                onClick={() => handleThemeChange(themeOption.id as Theme)}
                                className={clsx(
                                  "flex flex-col items-center justify-center gap-2 p-4 rounded-lg w-full transition-all",
                                  {
                                    "ring-2 ring-blue-500": theme === themeOption.id,
                                    "bg-gray-100 hover:bg-gray-200": theme === "light",
                                    "bg-gray-800 hover:bg-gray-700": theme === "dark",
                                    "bg-rose-100 hover:bg-rose-200": theme === "pastel",
                                  }
                                )}
                              >
                                {themeOption.icon}
                                <span>{themeOption.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Theme Settings</h4>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className={clsx(
                                  "w-5 h-5 rounded focus:ring-0",
                                  {
                                    "text-blue-600": theme === "light",
                                    "text-indigo-600": theme === "dark",
                                    "text-rose-600": theme === "pastel",
                                  }
                                )}
                                defaultChecked
                              />
                              <span>Sync with system theme</span>
                            </label>
                            
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className={clsx(
                                  "w-5 h-5 rounded focus:ring-0",
                                  {
                                    "text-blue-600": theme === "light",
                                    "text-indigo-600": theme === "dark",
                                    "text-rose-600": theme === "pastel",
                                  }
                                )}
                                defaultChecked
                              />
                              <span>Dim images in dark mode</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Audio Preferences */}
                    <div className={clsx(
                      "rounded-2xl p-6",
                      {
                        "bg-white border border-gray-200": theme === "light",
                        "bg-gray-800 border border-gray-700": theme === "dark",
                        "bg-white border border-rose-200": theme === "pastel",
                      }
                    )}>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Volume2 className="w-5 h-5" /> Audio Preferences
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-3">Audio Quality</h4>
                          <div className="flex gap-4">
                            {(["low", "medium", "high"] as AudioQuality[]).map(quality => (
                              <button
                                key={quality}
                                onClick={() => setAudioQuality(quality)}
                                className={clsx(
                                  "px-4 py-2 rounded-lg capitalize w-full transition-all",
                                  {
                                    "bg-blue-600 text-white": audioQuality === quality && theme === "light",
                                    "bg-gray-100 text-gray-800": audioQuality !== quality && theme === "light",
                                    "bg-indigo-600 text-white": audioQuality === quality && theme === "dark",
                                    "bg-gray-800 text-gray-300": audioQuality !== quality && theme === "dark",
                                    "bg-rose-600 text-white": audioQuality === quality && theme === "pastel",
                                    "bg-rose-100 text-rose-800": audioQuality !== quality && theme === "pastel",
                                  }
                                )}
                              >
                                {quality}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Default Volume</h4>
                          <div className="flex items-center gap-3">
                            <Volume2 className="w-5 h-5 opacity-70" />
                            <input 
                              type="range" 
                              min="0" 
                              max="100" 
                              value={volume}
                              onChange={(e) => setVolume(parseInt(e.target.value))}
                              className={clsx(
                                "w-full accent-blue-500",
                                {
                                  "accent-blue-500": theme === "light",
                                  "accent-indigo-500": theme === "dark",
                                  "accent-rose-500": theme === "pastel",
                                }
                              )}
                            />
                            <span className="w-12 text-right">{volume}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Language Preferences */}
                    <div className={clsx(
                      "rounded-2xl p-6",
                      {
                        "bg-white border border-gray-200": theme === "light",
                        "bg-gray-800 border border-gray-700": theme === "dark",
                        "bg-white border border-rose-200": theme === "pastel",
                      }
                    )}>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Globe className="w-5 h-5" /> Language & Region
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-3">App Language</h4>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className={clsx(
                              "w-full p-3 rounded-lg",
                              {
                                "bg-gray-50 border border-gray-200": theme === "light",
                                "bg-gray-700 border border-gray-600": theme === "dark",
                                "bg-rose-50 border border-rose-200": theme === "pastel",
                              }
                            )}
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                          </select>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Content Preferences</h4>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className={clsx(
                                  "w-5 h-5 rounded focus:ring-0",
                                  {
                                    "text-blue-600": theme === "light",
                                    "text-indigo-600": theme === "dark",
                                    "text-rose-600": theme === "pastel",
                                  }
                                )}
                                defaultChecked
                              />
                              <span>Prioritize content from my region</span>
                            </label>
                            
                            <label className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className={clsx(
                                  "w-5 h-5 rounded focus:ring-0",
                                  {
                                    "text-blue-600": theme === "light",
                                    "text-indigo-600": theme === "dark",
                                    "text-rose-600": theme === "pastel",
                                  }
                                )}
                              />
                              <span>Show cultural context by default</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Account Settings */}
                    <div className={clsx(
                      "rounded-2xl p-6",
                      {
                        "bg-white border border-gray-200": theme === "light",
                        "bg-gray-800 border border-gray-700": theme === "dark",
                        "bg-white border border-rose-200": theme === "pastel",
                      }
                    )}>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <User className="w-5 h-5" /> Account Settings
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Email</h4>
                          <div className="flex items-center justify-between">
                            <span>alex.morgan@example.com</span>
                            <button className="text-blue-600 hover:underline">Change</button>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Password</h4>
                          <div className="flex items-center justify-between">
                            <span>••••••••</span>
                            <button className="text-blue-600 hover:underline">Change</button>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Subscription</h4>
                          <div className="flex items-center justify-between">
                            <span>Explorer (Free)</span>
                            <button className={clsx(
                              "px-4 py-2 rounded-lg font-medium",
                              {
                                "bg-gray-800 text-white hover:bg-gray-700": theme === "light",
                                "bg-gray-700 text-white hover:bg-gray-600": theme === "dark",
                                "bg-rose-700 text-white hover:bg-rose-600": theme === "pastel",
                              }
                            )}>
                              Upgrade
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}