// app/about/page.tsx
'use client';

import { useState, useEffect } from "react";
import { 
  Globe, 
  Headphones, 
  Music, 
  BookOpen,
  Users,
  Heart,
  Award,
  Newspaper,
  Play,
  ArrowRight,
  Sun,
  Moon,
  Palette
} from "lucide-react";
import clsx from "clsx";
import {auth} from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Theme = "light" | "dark" | "pastel";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
}

interface PressMention {
  id: string;
  outlet: string;
  title: string;
  quote: string;
  date: string;
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

export default function AboutPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [activeMission, setActiveMission] = useState(0);
  const router = useRouter();

  // Theme persistence logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("sonara-theme") as Theme | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("sonara-theme", theme);
  }, [theme]);

  // Add authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Dr. Elena Rodriguez",
      role: "Founder & Lead Ethnomusicologist",
      bio: "With a PhD in Ethnomusicology from Oxford, Elena has spent 15 years documenting endangered musical traditions across 40+ countries. Her fieldwork in remote regions sparked the vision for Sonara.",
      expertise: ["Field Recording", "Cultural Preservation", "Academic Research"]
    },
    {
      id: "2",
      name: "James Chen",
      role: "Technical Director",
      bio: "Former audio engineer at National Geographic, James brings expertise in high-fidelity field recording and spatial audio technologies. He's designed Sonara's unique audio preservation system.",
      expertise: ["Audio Engineering", "Spatial Audio", "Technical Innovation"]
    },
    {
      id: "3",
      name: "Aisha N'Doye",
      role: "Community Outreach Lead",
      bio: "Born in Senegal and raised in France, Aisha bridges cultural gaps by connecting with indigenous communities. She ensures ethical partnerships and fair compensation for contributors.",
      expertise: ["Community Relations", "Cultural Ethics", "Partnership Development"]
    },
    {
      id: "4",
      name: "Marcus Johnson",
      role: "Product Designer",
      bio: "Marcus creates immersive experiences that make cultural discovery intuitive. His design philosophy centers on emotional connection through sound and storytelling.",
      expertise: ["UX Design", "Sound Experience", "Visual Storytelling"]
    }
  ];

  const pressMentions: PressMention[] = [
    {
      id: "1",
      outlet: "National Geographic",
      title: "Sonic Time Capsules: Preserving the World's Vanishing Soundscapes",
      quote: "Sonara is creating the most comprehensive audio archive of human musical heritage ever attempted.",
      date: "March 15, 2023"
    },
    {
      id: "2",
      outlet: "The Guardian",
      title: "The Digital Preservation of Endangered Musical Traditions",
      quote: "In an age of cultural homogenization, Sonara provides a vital counterbalance by amplifying voices that mainstream platforms ignore.",
      date: "August 7, 2023"
    },
    {
      id: "3",
      outlet: "Wired",
      title: "How Technology is Saving the World's Rarest Instruments",
      quote: "Sonara's approach combines cutting-edge audio tech with deep cultural sensitivity - a model for digital preservation.",
      date: "January 22, 2024"
    }
  ];

  const missions = [
    {
      title: "Preserve",
      description: "Document endangered musical traditions before they disappear",
      icon: <BookOpen className="w-6 h-6" />
    },
    {
      title: "Connect",
      description: "Bridge cultural divides through shared sonic experiences",
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: "Educate",
      description: "Provide cultural context that transforms listening into learning",
      icon: <Headphones className="w-6 h-6" />
    },
    {
      title: "Empower",
      description: "Support indigenous artists and communities through fair partnerships",
      icon: <Users className="w-6 h-6" />
    }
  ];

  const impactStats = [
    { value: "4,200+", label: "Recordings Preserved" },
    { value: "142", label: "Countries Represented" },
    { value: "78", label: "Endangered Traditions Documented" },
    { value: "350+", label: "Community Partnerships" }
  ];

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
            <span className="ml-4 opacity-70">/ About</span>
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

      <main>
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-72 rounded-full blur-3xl opacity-30">
            <div className={clsx(
              "w-full h-full",
              {
                "bg-blue-400": theme === "light",
                "bg-indigo-600": theme === "dark",
                "bg-rose-400": theme === "pastel",
              }
            )}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6",
                {
                  "bg-blue-100 text-blue-600": theme === "light",
                  "bg-indigo-900/50 text-indigo-200": theme === "dark",
                  "bg-rose-200/50 text-rose-700": theme === "pastel",
                }
              )}>
                <span className="animate-pulse">✨</span>
                <span>Preserving the World's Sonic Heritage</span>
              </div>
              
              <h1 className={clsx(
                "text-4xl md:text-6xl font-bold mb-6 leading-tight",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Our Mission: To Save the World's Vanishing Soundscapes
              </h1>
              
              <p className={clsx(
                "text-xl max-w-2xl mx-auto mb-10",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-300": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Sonara is a global initiative dedicated to preserving, celebrating, and sharing the world's diverse musical heritage before it disappears.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className={clsx(
                "text-3xl md:text-4xl font-bold mb-6",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Why We Do This Work
              </h2>
              <p className={clsx(
                "text-lg max-w-2xl mx-auto",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-400": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Every 14 days, a language dies. With it, centuries of musical tradition vanish. We're racing against time to preserve humanity's sonic diversity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {missions.map((mission, index) => (
                <div 
                  key={index}
                  className={clsx(
                    "rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2",
                    {
                      "bg-white border border-gray-200 shadow-sm": theme === "light",
                      "bg-gray-800/50 border border-gray-700": theme === "dark",
                      "bg-white/50 border border-rose-200": theme === "pastel",
                      "ring-2": activeMission === index,
                      "ring-blue-500 ring-offset-2": activeMission === index && theme === "light",
                      "ring-indigo-500 ring-offset-gray-900": activeMission === index && theme === "dark",
                      "ring-rose-500 ring-offset-rose-50": activeMission === index && theme === "pastel",
                    }
                  )}
                  onClick={() => setActiveMission(index)}
                >
                  <div className={clsx(
                    "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
                    {
                      "bg-blue-100 text-blue-600": theme === "light",
                      "bg-indigo-900/50 text-indigo-300": theme === "dark",
                      "bg-rose-100 text-rose-600": theme === "pastel",
                    }
                  )}>
                    {mission.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{mission.title}</h3>
                  <p className={clsx(
                    {
                      "text-gray-600": theme === "light",
                      "text-gray-400": theme === "dark",
                      "text-rose-700": theme === "pastel",
                    }
                  )}>
                    {mission.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className={clsx(
          "py-20",
          {
            "bg-gradient-to-r from-blue-50 to-indigo-50": theme === "light",
            "bg-gradient-to-r from-gray-800 to-indigo-900/30": theme === "dark",
            "bg-gradient-to-r from-rose-50 to-amber-50": theme === "pastel",
          }
        )}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className={clsx(
                "text-3xl md:text-4xl font-bold mb-6",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Our Impact
              </h2>
              <p className={clsx(
                "text-lg max-w-2xl mx-auto",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-400": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Since our founding in 2020, we've documented traditions that might otherwise have been lost to history.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {impactStats.map((stat, index) => (
                <div 
                  key={index}
                  className={clsx(
                    "rounded-2xl p-6 text-center",
                    {
                      "bg-white border border-gray-200 shadow-sm": theme === "light",
                      "bg-gray-800/50 border border-gray-700": theme === "dark",
                      "bg-white border border-rose-200": theme === "pastel",
                    }
                  )}
                >
                  <div className={clsx(
                    "text-3xl md:text-4xl font-bold mb-2",
                    {
                      "text-blue-600": theme === "light",
                      "text-indigo-400": theme === "dark",
                      "text-rose-600": theme === "pastel",
                    }
                  )}>
                    {stat.value}
                  </div>
                  <p className={clsx(
                    "font-medium",
                    {
                      "text-gray-600": theme === "light",
                      "text-gray-400": theme === "dark",
                      "text-rose-700": theme === "pastel",
                    }
                  )}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className={clsx(
                "text-3xl md:text-4xl font-bold mb-6",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Meet Our Team
              </h2>
              <p className={clsx(
                "text-lg max-w-2xl mx-auto",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-400": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Passionate explorers, ethnomusicologists, and technologists united by a mission to preserve sonic heritage.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {teamMembers.map(member => (
                <div 
                  key={member.id}
                  className={clsx(
                    "rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2",
                    {
                      "bg-white border border-gray-200 shadow-sm": theme === "light",
                      "bg-gray-800 border border-gray-700": theme === "dark",
                      "bg-white border border-rose-200": theme === "pastel",
                    }
                  )}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-gray-200 border-2 border-dashed min-h-[200px]" />
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className={clsx(
                        "mb-4 font-medium",
                        {
                          "text-blue-600": theme === "light",
                          "text-indigo-400": theme === "dark",
                          "text-rose-600": theme === "pastel",
                        }
                      )}>
                        {member.role}
                      </p>
                      <p className={clsx(
                        "mb-4",
                        {
                          "text-gray-600": theme === "light",
                          "text-gray-400": theme === "dark",
                          "text-rose-700": theme === "pastel",
                        }
                      )}>
                        {member.bio}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, idx) => (
                          <span 
                            key={idx}
                            className={clsx(
                              "px-3 py-1 rounded-full text-sm",
                              {
                                "bg-blue-100 text-blue-800": theme === "light",
                                "bg-indigo-900/50 text-indigo-200": theme === "dark",
                                "bg-rose-100 text-rose-800": theme === "pastel",
                              }
                            )}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Section */}
        <section className={clsx(
          "py-20",
          {
            "bg-gradient-to-r from-blue-50 to-indigo-50": theme === "light",
            "bg-gradient-to-r from-gray-800 to-indigo-900/30": theme === "dark",
            "bg-gradient-to-r from-rose-50 to-amber-50": theme === "pastel",
          }
        )}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className={clsx(
                "text-3xl md:text-4xl font-bold mb-6",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Press & Recognition
              </h2>
              <p className={clsx(
                "text-lg max-w-2xl mx-auto",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-400": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Sonara's work has been featured by leading publications and cultural institutions worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pressMentions.map(mention => (
                <div 
                  key={mention.id}
                  className={clsx(
                    "rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2",
                    {
                      "bg-white border border-gray-200 shadow-sm": theme === "light",
                      "bg-gray-800/50 border border-gray-700": theme === "dark",
                      "bg-white border border-rose-200": theme === "pastel",
                    }
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Newspaper className="w-5 h-5 opacity-70" />
                    <span className="font-bold">{mention.outlet}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3">{mention.title}</h3>
                  <p className={clsx(
                    "italic mb-4",
                    {
                      "text-gray-600": theme === "light",
                      "text-gray-400": theme === "dark",
                      "text-rose-700": theme === "pastel",
                    }
                  )}>
                    "{mention.quote}"
                  </p>
                  <div className="text-sm opacity-70">{mention.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className={clsx(
              "rounded-3xl p-12 text-center max-w-4xl mx-auto",
              {
                "bg-gradient-to-r from-blue-500 to-indigo-600 text-white": theme === "light",
                "bg-gradient-to-r from-indigo-700 to-purple-800 text-white": theme === "dark",
                "bg-gradient-to-r from-rose-500 to-amber-500 text-white": theme === "pastel",
              }
            )}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join Our Mission
              </h2>
              <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
                Help us preserve the world's musical heritage for future generations.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white px-8 py-4 rounded-xl font-bold transition-all hover:opacity-90">
                  <span className={clsx(
                    "bg-clip-text text-transparent bg-gradient-to-r",
                    {
                      "from-blue-500 to-indigo-600": theme === "light",
                      "from-indigo-700 to-purple-800": theme === "dark",
                      "from-rose-500 to-amber-500": theme === "pastel",
                    }
                  )}>
                    Support Our Work
                  </span>
                </button>
                <button className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-white/10">
                  Explore Collections
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={clsx(
        "py-12 border-t",
        {
          "border-gray-200": theme === "light",
          "border-gray-800": theme === "dark",
          "border-rose-200": theme === "pastel",
        }
      )}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className={clsx(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                {
                  "bg-blue-600 text-white": theme === "light",
                  "bg-indigo-600 text-white": theme === "dark",
                  "bg-rose-400 text-rose-900": theme === "pastel",
                }
              )}>
                <Music className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Sonara</h2>
            </div>
            
            <p className={clsx(
              "text-center",
              {
                "text-gray-600": theme === "light",
                "text-gray-500": theme === "dark",
                "text-rose-700": theme === "pastel",
              }
            )}>
              © {new Date().getFullYear()} Sonara. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              {["Twitter", "Instagram", "YouTube", "Spotify"].map((platform, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className={clsx(
                    "hover:opacity-70 transition-opacity",
                    {
                      "text-gray-600": theme === "light",
                      "text-gray-400": theme === "dark",
                      "text-rose-700": theme === "pastel",
                    }
                  )}
                >
                  {platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}