// app/track/[id]/page.tsx
'use client';

import { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  Heart, 
  Share2, 
  Download, 
  MapPin, 
  Music, 
  Users, 
  BookOpen,
  Globe,
  Disc,
  Clock,
  ArrowLeft,
  Sun,
  Moon,
  Palette,
  Headphones
} from "lucide-react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {auth} from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";

type Theme = "light" | "dark" | "pastel";

interface Artist {
  id: string;
  name: string;
  bio: string;
  region: string;
}

interface Instrument {
  id: string;
  name: string;
  description: string;
  image?: string;
}

interface Track {
  id: string;
  title: string;
  artist: Artist;
  duration: string;
  location: string;
  coordinates: [number, number];
  recordingDate: string;
  culturalContext: string;
  instruments: Instrument[];
  tags: string[];
  audioUrl: string;
}

// Define the correct type for Next.js dynamic route page props
interface TrackPageProps {
  params: { id: string };
}

export default function TrackPage({ params }: TrackPageProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>("light");
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [relatedTracks, setRelatedTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

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
    // Simulate data loading
    setTimeout(() => {
      setTrack({
        id: params.id,
        title: "River Dawn Chant",
        artist: {
          id: "1",
          name: "Tribe of the Hummingbird",
          bio: "An indigenous group preserving Amazonian musical traditions for generations.",
          region: "Amazon Rainforest, Brazil"
        },
        duration: "4:32",
        location: "Xingu River, Amazonas, Brazil",
        coordinates: [-3.4653, -62.2159],
        recordingDate: "June 15, 2023",
        culturalContext: "This dawn chant is traditionally performed by women at the river's edge as the community awakens. The melody mimics bird calls and flowing water, serving as a daily connection to nature spirits. The chant is believed to bring good fortune for the day's fishing and gathering activities.",
        instruments: [
          {
            id: "1",
            name: "Berimbau",
            description: "A single-string percussion instrument made from a wooden bow and gourd resonator."
          },
          {
            id: "2",
            name: "Teponaztli",
            description: "A hollow wooden drum played with rubber-tipped mallets."
          },
          {
            id: "3",
            name: "Quena",
            description: "Traditional Andean flute made from bamboo or wood."
          }
        ],
        tags: ["Nature", "Ritual", "Dawn", "Amazon", "Indigenous"],
        audioUrl: "/samples/river-dawn.mp3"
      });
      
      setRelatedTracks([
        {
          id: "2",
          title: "Jaguar Spirit Dance",
          artist: {
            id: "2",
            name: "Amazon Drum Collective",
            bio: "Traditional percussionists from multiple Amazonian tribes",
            region: "Amazon Rainforest, Brazil"
          },
          duration: "3:45",
          location: "Manaus, Brazil",
          coordinates: [-3.1190, -60.0217],
          recordingDate: "May 22, 2023",
          culturalContext: "Ceremonial drumming for the jaguar spirit ritual",
          instruments: [
            { id: "4", name: "Pandeiro", description: "Brazilian tambourine" },
            { id: "5", name: "Atabaque", description: "Tall wooden drum" }
          ],
          tags: ["Ritual", "Drum", "Ceremonial", "Amazon"],
          audioUrl: "/samples/jaguar-spirit.mp3"
        },
        {
          id: "3",
          title: "Canopy Rain Song",
          artist: {
            id: "3",
            name: "Forest Voices",
            bio: "Vocal ensemble specializing in rainforest soundscapes",
            region: "Amazon Rainforest, Peru"
          },
          duration: "5:21",
          location: "Iquitos, Peru",
          coordinates: [-3.7491, -73.2538],
          recordingDate: "April 10, 2023",
          culturalContext: "Vocal imitation of rainforest during rainfall",
          instruments: [
            { id: "6", name: "Maracas", description: "Percussion shakers" },
            { id: "7", name: "Rainstick", description: "Instrument mimicking rain sounds" }
          ],
          tags: ["Nature", "Rain", "Vocal", "Amazon"],
          audioUrl: "/samples/canopy-rain.mp3"
        },
        {
          id: "4",
          title: "Mystic Forest Echoes",
          artist: {
            id: "4",
            name: "Shamanic Sound Group",
            bio: "Healers using traditional sound techniques",
            region: "Amazon Rainforest, Colombia"
          },
          duration: "6:15",
          location: "Leticia, Colombia",
          coordinates: [-4.2150, -69.9381],
          recordingDate: "July 5, 2023",
          culturalContext: "Healing ceremony soundscape with plant spirits",
          instruments: [
            { id: "8", name: "Ocarina", description: "Ancient vessel flute" },
            { id: "9", name: "Seed Pod Shakers", description: "Natural percussion instruments" }
          ],
          tags: ["Healing", "Ceremonial", "Shamanic", "Amazon"],
          audioUrl: "/samples/forest-echoes.mp3"
        }
      ]);
      
      setDuration(272); // 4:32 in seconds
      setLoading(false);
    }, 800);
  }, [params.id]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleBack = () => {
    router.back();
  };

  // Sexy NavBar component
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
        <a href="#" className="px-5 py-2 rounded-full font-semibold bg-white/20 hover:bg-white/30 transition-all shadow text-white">Sign In</a>
        <Link href="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
          </svg>
        </Link>
      </div>
    </nav>
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className={clsx(
        "min-h-screen flex items-center justify-center",
        {
          "bg-white": theme === "light",
          "bg-gray-900": theme === "dark",
          "bg-rose-50": theme === "pastel",
        }
      )}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className={clsx(
        "min-h-screen flex flex-col items-center justify-center p-8 text-center",
        {
          "bg-white": theme === "light",
          "bg-gray-900": theme === "dark",
          "bg-rose-50": theme === "pastel",
        }
      )}>
        <Music className="w-16 h-16 mb-4 opacity-50" />
        <h2 className={clsx(
          "text-2xl font-bold mb-2",
          {
            "text-gray-900": theme === "light",
            "text-white": theme === "dark",
            "text-rose-900": theme === "pastel",
          }
        )}>
          Track Not Found
        </h2>
        <p className={clsx(
          "mb-6 max-w-md",
          {
            "text-gray-600": theme === "light",
            "text-gray-400": theme === "dark",
            "text-rose-700": theme === "pastel",
          }
        )}>
          The sound you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <button
          onClick={handleBack}
          className={clsx(
            "flex items-center gap-2 px-6 py-3 rounded-lg font-medium",
            {
              "bg-gray-800 text-white hover:bg-gray-700": theme === "light",
              "bg-gray-700 text-white hover:bg-gray-600": theme === "dark",
              "bg-rose-700 text-white hover:bg-rose-600": theme === "pastel",
            }
          )}
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Library
        </button>
      </div>
    );
  }

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
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back</span>
          </button>
          
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
          {/* Main Content - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Track Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-sm",
                      {
                        "bg-blue-100 text-blue-800": theme === "light",
                        "bg-indigo-900/50 text-indigo-200": theme === "dark",
                        "bg-rose-100 text-rose-800": theme === "pastel",
                      }
                    )}>
                      Field Recording
                    </span>
                    <div className="flex items-center gap-1 text-sm opacity-80">
                      <Clock className="w-4 h-4" />
                      <span>{track.duration}</span>
                    </div>
                  </div>
                  
                  <h1 className={clsx(
                    "text-3xl md:text-4xl font-bold mb-2",
                    {
                      "text-gray-900": theme === "light",
                      "text-white": theme === "dark",
                      "text-rose-900": theme === "pastel",
                    }
                  )}>
                    {track.title}
                  </h1>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 opacity-70" />
                      <span className="font-medium">{track.artist.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 opacity-70" />
                      <span>{track.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Disc className="w-5 h-5 opacity-70" />
                      <span>{track.recordingDate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button className={clsx(
                    "p-3 rounded-full",
                    {
                      "hover:bg-gray-100": theme === "light",
                      "hover:bg-gray-800": theme === "dark",
                      "hover:bg-rose-100": theme === "pastel",
                    }
                  )}>
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className={clsx(
                    "p-3 rounded-full",
                    {
                      "hover:bg-gray-100": theme === "light",
                      "hover:bg-gray-800": theme === "dark",
                      "hover:bg-rose-100": theme === "pastel",
                    }
                  )}>
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className={clsx(
                    "p-3 rounded-full",
                    {
                      "hover:bg-gray-100": theme === "light",
                      "hover:bg-gray-800": theme === "dark",
                      "hover:bg-rose-100": theme === "pastel",
                    }
                  )}>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {track.tags.map(tag => (
                  <span 
                    key={tag}
                    className={clsx(
                      "px-3 py-1 rounded-full text-sm",
                      {
                        "bg-gray-100": theme === "light",
                        "bg-gray-800": theme === "dark",
                        "bg-rose-100": theme === "pastel",
                      }
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Audio Player */}
            <div className={clsx(
              "rounded-2xl overflow-hidden mb-8",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
              }
            )}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
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
                    <span className="font-medium">Now Playing</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 opacity-70" />
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
                  "h-2 rounded-full overflow-hidden mb-1",
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
                    style={{ width: `${(0 / duration) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm opacity-80">
                  <span>{formatTime(0)}</span>
                  <span>{track.duration}</span>
                </div>
              </div>
            </div>
            
            {/* Artist Info */}
            <div className={clsx(
              "rounded-2xl overflow-hidden mb-8",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
              }
            )}>
              <div className="p-6">
                <h2 className={clsx(
                  "text-xl font-bold mb-4 flex items-center gap-2",
                  {
                    "text-gray-900": theme === "light",
                    "text-white": theme === "dark",
                    "text-rose-900": theme === "pastel",
                  }
                )}>
                  <Users className="w-5 h-5" /> About the Artist
                </h2>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 md:w-24 md:h-24" />
                  
                  <div>
                    <h3 className="text-lg font-bold mb-2">{track.artist.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-4 h-4 opacity-70" />
                      <span>{track.artist.region}</span>
                    </div>
                    <p className="opacity-90">{track.artist.bio}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cultural Context */}
            <div className={clsx(
              "rounded-2xl overflow-hidden mb-8",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
              }
            )}>
              <div className="p-6">
                <h2 className={clsx(
                  "text-xl font-bold mb-4 flex items-center gap-2",
                  {
                    "text-gray-900": theme === "light",
                    "text-white": theme === "dark",
                    "text-rose-900": theme === "pastel",
                  }
                )}>
                  <BookOpen className="w-5 h-5" /> Cultural Context
                </h2>
                
                <p className="opacity-90 mb-6">{track.culturalContext}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold mb-3">Historical Significance</h3>
                    <p className="opacity-80">
                      This chant dates back over 300 years and was nearly lost during the rubber boom era. 
                      It was preserved through oral tradition by elder women of the tribe.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-3">Modern Relevance</h3>
                    <p className="opacity-80">
                      Today, the chant is taught in local schools as part of cultural preservation efforts. 
                      It&apos;s performed during eco-tourism events to raise awareness about rainforest conservation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Instruments */}
            <div className={clsx(
              "rounded-2xl overflow-hidden mb-8",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
              }
            )}>
              <div className="p-6">
                <h2 className={clsx(
                  "text-xl font-bold mb-4 flex items-center gap-2",
                  {
                    "text-gray-900": theme === "light",
                    "text-white": theme === "dark",
                    "text-rose-900": theme === "pastel",
                  }
                )}>
                  <Music className="w-5 h-5" /> Instruments Used
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {track.instruments.map(instrument => (
                    <div 
                      key={instrument.id}
                      className={clsx(
                        "p-4 rounded-lg",
                        {
                          "bg-gray-50": theme === "light",
                          "bg-gray-700/50": theme === "dark",
                          "bg-rose-50": theme === "pastel",
                        }
                      )}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                        <h3 className="font-bold">{instrument.name}</h3>
                      </div>
                      <p className="text-sm opacity-80">{instrument.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Location Map */}
            <div className={clsx(
              "rounded-2xl overflow-hidden mb-8",
              {
                "bg-white border border-gray-200": theme === "light",
                "bg-gray-800 border border-gray-700": theme === "dark",
                "bg-white border border-rose-200": theme === "pastel",
              }
            )}>
              <div className="p-6">
                <h2 className={clsx(
                  "text-xl font-bold mb-4 flex items-center gap-2",
                  {
                    "text-gray-900": theme === "light",
                    "text-white": theme === "dark",
                    "text-rose-900": theme === "pastel",
                  }
                )}>
                  <MapPin className="w-5 h-5" /> Recording Location
                </h2>
                
                <div className="h-64 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">{track.location}</p>
                    <p className="text-sm opacity-70">Coordinates: {track.coordinates.join(", ")}</p>
                  </div>
                </div>
                
                <p className="opacity-80">
                  This recording was captured at sunrise on the banks of the Xingu River, 
                  a tributary of the Amazon known for its biodiversity and cultural significance 
                  to indigenous communities.
                </p>
              </div>
            </div>
          </div>
          
          {/* Sidebar - 1/3 width */}
          <div className="lg:w-1/3">
            {/* Related Sounds */}
            <div className="sticky top-24">
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
                  <h3 className="text-xl font-bold">Related Sounds</h3>
                  <p className="opacity-90">Similar recordings you might enjoy</p>
                </div>
                
                <div className="p-5">
                  <div className="space-y-4">
                    {relatedTracks.map(relatedTrack => (
                      <div 
                        key={relatedTrack.id}
                        className="flex items-center gap-4 group cursor-pointer"
                        onClick={() => router.push(`/track/${relatedTrack.id}`)}
                      >
                        <div className="bg-gray-200 border-2 border-dashed rounded-lg w-16 h-16 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold truncate">{relatedTrack.title}</h4>
                          <p className="text-sm opacity-70 truncate">{relatedTrack.artist.name}</p>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{relatedTrack.location}</span>
                          </div>
                        </div>
                        <button className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                          {
                            "bg-blue-100 text-blue-600": theme === "light",
                            "bg-indigo-900/50 text-indigo-300": theme === "dark",
                            "bg-rose-100 text-rose-600": theme === "pastel",
                          }
                        )}>
                          <Play className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Download Options */}
              <div className={clsx(
                "rounded-2xl overflow-hidden",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-4">Download Options</h3>
                  
                  <div className="space-y-3">
                    <button className={clsx(
                      "w-full py-3 rounded-lg text-left px-4 flex items-center gap-3",
                      {
                        "hover:bg-gray-100": theme === "light",
                        "hover:bg-gray-700/50": theme === "dark",
                        "hover:bg-rose-50": theme === "pastel",
                      }
                    )}>
                      <div className={clsx(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        {
                          "bg-blue-100 text-blue-600": theme === "light",
                          "bg-indigo-900/50 text-indigo-300": theme === "dark",
                          "bg-rose-100 text-rose-600": theme === "pastel",
                        }
                      )}>
                        <Headphones className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">MP3 Format</div>
                        <div className="text-sm opacity-70">Standard quality (320kbps)</div>
                      </div>
                    </button>
                    
                    <button className={clsx(
                      "w-full py-3 rounded-lg text-left px-4 flex items-center gap-3",
                      {
                        "hover:bg-gray-100": theme === "light",
                        "hover:bg-gray-700/50": theme === "dark",
                        "hover:bg-rose-50": theme === "pastel",
                      }
                    )}>
                      <div className={clsx(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        {
                          "bg-green-100 text-green-600": theme === "light",
                          "bg-emerald-900/50 text-emerald-300": theme === "dark",
                          "bg-emerald-100 text-emerald-600": theme === "pastel",
                        }
                      )}>
                        <Disc className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">WAV Format</div>
                        <div className="text-sm opacity-70">Lossless quality (24-bit)</div>
                      </div>
                    </button>
                    
                    <button className={clsx(
                      "w-full py-3 rounded-lg text-left px-4 flex items-center gap-3",
                      {
                        "hover:bg-gray-100": theme === "light",
                        "hover:bg-gray-700/50": theme === "dark",
                        "hover:bg-rose-50": theme === "pastel",
                      }
                    )}>
                      <div className={clsx(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        {
                          "bg-purple-100 text-purple-600": (theme === "light" || theme === "pastel"),
                          "bg-purple-900/50 text-purple-300": theme === "dark",
                        }
                      )}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium">Full Documentation</div>
                        <div className="text-sm opacity-70">PDF with cultural notes</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}