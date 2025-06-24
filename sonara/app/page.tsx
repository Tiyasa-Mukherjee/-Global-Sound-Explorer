// app/page.tsx
'use client';

import { useState, useEffect } from "react";
import { 
  Sun, 
  Moon, 
  Palette, 
  Globe, 
  Headphones, 
  Music, 
  BookOpen, 
  Play, 
  ArrowRight, 
  ChevronRight,
  Check 
} from "lucide-react";
import clsx from "clsx";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

type Theme = "light" | "dark" | "pastel";
type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function SonaraLanding() {
  const [theme, setTheme] = useState<Theme>("light");

  // Theme persistence logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("sonara-theme") as Theme | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("sonara-theme", theme);
  }, [theme]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/profile";
    } catch {
      alert("Google sign-in failed");
    }
  };

  const features: Feature[] = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Sound Map",
      description: "Explore music traditions through an interactive world map with region-specific audio samples"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Cultural Insights",
      description: "Deep dive into the history and meaning behind each musical tradition"
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Instrument Library",
      description: "Discover rare instruments with 3D models and playing techniques"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Curated Journeys",
      description: "Guided audio tours through musical regions and historical periods"
    }
  ];

  const testimonials = [
    {
      quote: "Sonara opened my ears to musical traditions I never knew existed. It's like having a personal ethnomusicologist.",
      author: "Alex Rivera",
      role: "Music Producer"
    },
    {
      quote: "As an anthropology student, Sonara has been invaluable for understanding cultural expressions through sound.",
      author: "Priya Sharma",
      role: "Anthropology Student"
    },
    {
      quote: "The depth of cultural context combined with pristine audio quality makes Sonara truly exceptional.",
      author: "Marcus Johnson",
      role: "Audiophile"
    }
  ];

  const pricingPlans = [
    {
      name: "Explorer",
      price: "Free",
      features: ["Access to 5 regions", "Limited audio samples", "Basic cultural notes"],
      cta: "Get Started"
    },
    {
      name: "Traveler",
      price: "$7.99",
      period: "/month",
      features: ["All regions unlocked", "Full audio libraries", "Detailed cultural insights", "Offline listening"],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Scholar",
      price: "$79",
      period: "/year",
      features: ["All Traveler features", "Exclusive content", "Early access to new regions", "Scholar community"],
      cta: "Save 20%"
    }
  ];

  return (
    <div className={clsx(
      "min-h-screen font-sans antialiased transition-all duration-500",
      {
        "bg-gradient-to-br from-white to-gray-50 text-gray-900": theme === "light",
        "bg-gradient-to-br from-gray-900 to-gray-950 text-white": theme === "dark",
        "bg-gradient-to-br from-rose-50 to-amber-50 text-rose-900": theme === "pastel",
      }
    )}>
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
              <Music className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Sonara</h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="/explore" className="font-medium hover:opacity-80 transition-opacity">Explore</a>
            <a href="/library-curated_collections" className="font-medium hover:opacity-80 transition-opacity">Library</a>
            <a href="/track_id-track_details" className="font-medium hover:opacity-80 transition-opacity">Track ID</a>
            <a href="/about_page" className="font-medium hover:opacity-80 transition-opacity">About</a>
          </nav>
          
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
            <button
              onClick={handleGoogleSignIn}
              className={clsx(
                "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
                {
                  "bg-gray-900 text-white hover:bg-gray-800": theme === "light",
                  "bg-white text-gray-900 hover:bg-gray-100": theme === "dark",
                  "bg-rose-700 text-rose-50 hover:bg-rose-600": theme === "pastel",
                }
              )}
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.5 6.2 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.2 17.1 19.2 14 24 14c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.5 6.2 29.5 4 24 4c-7.2 0-13.3 4.1-16.7 10.7z"/><path fill="#FBBC05" d="M24 44c5.8 0 10.7-1.9 14.3-5.2l-6.6-5.4C29.7 35.1 27 36 24 36c-5.7 0-10.5-3.7-12.2-8.8l-7 5.4C7.9 39.9 15.3 44 24 44z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.2 41.9 19.2 44 24 44c7.2 0 13.3-4.1 16.7-10.7z"/></g></svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
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
            <div className="max-w-3xl mx-auto text-center">
              <div className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6",
                {
                  "bg-blue-100 text-blue-600": theme === "light",
                  "bg-indigo-900/50 text-indigo-200": theme === "dark",
                  "bg-rose-200/50 text-rose-700": theme === "pastel",
                }
              )}>
                <span className="animate-pulse">✨</span>
                <span>Discover the World&apos;s Musical Heritage</span>
              </div>
              
              <h1 className={clsx(
                "text-4xl md:text-6xl font-bold mb-6 leading-tight",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Explore Music From Every Corner of the World
              </h1>
              
              <p className={clsx(
                "text-xl max-w-2xl mx-auto mb-10",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-300": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Sonara is your gateway to the world&apos;s musical heritage — folk rhythms, ancient chants, indigenous instruments, and vibrant regional sounds.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className={clsx(
                  "flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg",
                  {
                    "bg-blue-600 text-white hover:bg-blue-700": theme === "light",
                    "bg-indigo-600 text-white hover:bg-indigo-500": theme === "dark",
                    "bg-rose-600 text-white hover:bg-rose-500": theme === "pastel",
                  }
                )}>
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button className={clsx(
                  "flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all border",
                  {
                    "border-gray-300 text-gray-900 hover:bg-gray-50": theme === "light",
                    "border-gray-700 text-white hover:bg-gray-800/30": theme === "dark",
                    "border-rose-300 text-rose-900 hover:bg-rose-100": theme === "pastel",
                  }
                )}>
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className={clsx(
                "text-3xl md:text-4xl font-bold mb-6",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Journey Through Sound
              </h2>
              <p className={clsx(
                "text-lg max-w-2xl mx-auto",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-400": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Sonara brings you immersive experiences that connect you to musical traditions across the globe.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={clsx(
                    "rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2",
                    {
                      "bg-white border border-gray-200 shadow-sm": theme === "light",
                      "bg-gray-800/50 border border-gray-700": theme === "dark",
                      "bg-white/50 border border-rose-200": theme === "pastel",
                    }
                  )}
                >
                  <div className={clsx(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                    {
                      "bg-blue-100 text-blue-600": theme === "light",
                      "bg-indigo-900/50 text-indigo-300": theme === "dark",
                      "bg-rose-100 text-rose-600": theme === "pastel",
                    }
                  )}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className={clsx(
                    {
                      "text-gray-600": theme === "light",
                      "text-gray-400": theme === "dark",
                      "text-rose-700": theme === "pastel",
                    }
                  )}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/2">
                <div className={clsx(
                  "rounded-3xl overflow-hidden shadow-xl border",
                  {
                    "border-gray-200": theme === "light",
                    "border-gray-700": theme === "dark",
                    "border-rose-200": theme === "pastel",
                  }
                )}>
                  <div className="bg-gray-200 border-b border-gray-300 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <div className={clsx(
                        "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                        {
                          "bg-blue-100 text-blue-600": theme === "light",
                          "bg-indigo-900/50 text-indigo-300": theme === "dark",
                          "bg-rose-100 text-rose-600": theme === "pastel",
                        }
                      )}>
                        <Headphones className="w-10 h-10" />
                      </div>
                      <p className={clsx(
                        "font-medium",
                        {
                          "text-gray-600": theme === "light",
                          "text-gray-400": theme === "dark",
                          "text-rose-700": theme === "pastel",
                        }
                      )}>
                        Interactive Sound Map Preview
                      </p>
                    </div>
                  </div>
                  <div className={clsx(
                    "p-6",
                    {
                      "bg-white": theme === "light" || theme === "pastel",
                      "bg-gray-800": theme === "dark",
                    }
                  )}>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-bold text-lg">West African Rhythms</h4>
                        <p className={clsx(
                          "text-sm",
                          {
                            "text-gray-500": theme === "light" || theme === "dark",
                            "text-rose-600": theme === "pastel",
                          }
                        )}>
                          Mali, Senegal, Guinea
                        </p>
                      </div>
                      <button className={clsx(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        {
                          "bg-blue-600 text-white": theme === "light",
                          "bg-indigo-600 text-white": theme === "dark",
                          "bg-rose-500 text-white": theme === "pastel",
                        }
                      )}>
                        <Play className="w-5 h-5 fill-current" />
                      </button>
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
                          "h-full w-1/3",
                          {
                            "bg-blue-600": theme === "light",
                            "bg-indigo-500": theme === "dark",
                            "bg-rose-500": theme === "pastel",
                          }
                        )}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <h2 className={clsx(
                  "text-3xl md:text-4xl font-bold mb-6",
                  {
                    "text-gray-900": theme === "light",
                    "text-white": theme === "dark",
                    "text-rose-900": theme === "pastel",
                  }
                )}>
                  Immerse Yourself in Cultural Soundscapes
                </h2>
                
                <p className={clsx(
                  "text-lg mb-8",
                  {
                    "text-gray-600": theme === "light",
                    "text-gray-400": theme === "dark",
                    "text-rose-700": theme === "pastel",
                  }
                )}>
                  Sonara goes beyond streaming by providing rich cultural context, instrument details, and historical background for every recording.
                </p>
                
                <ul className="space-y-4 mb-10">
                  {[
                    "High-fidelity field recordings from remote locations",
                    "Expert commentary from ethnomusicologists",
                    "Interactive learning modules",
                    "Curated playlists by region, instrument, and tradition"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                        {
                          "bg-blue-100 text-blue-600": theme === "light",
                          "bg-indigo-900/50 text-indigo-300": theme === "dark",
                          "bg-rose-100 text-rose-600": theme === "pastel",
                        }
                      )}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={clsx(
                  "flex items-center gap-2 font-medium group",
                  {
                    "text-blue-600": theme === "light",
                    "text-indigo-400": theme === "dark",
                    "text-rose-600": theme === "pastel",
                  }
                )}>
                  Explore the full library
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
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
                Loved by Ethnomusicologists & Explorers
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={clsx(
                    "rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2",
                    {
                      "bg-white border border-gray-200 shadow-sm": theme === "light",
                      "bg-gray-800/50 border border-gray-700": theme === "dark",
                      "bg-white/50 border border-rose-200": theme === "pastel",
                    }
                  )}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className={clsx(
                    "text-lg mb-6",
                    {
                      "text-gray-600": theme === "light",
                      "text-gray-400": theme === "dark",
                      "text-rose-700": theme === "pastel",
                    }
                  )}>
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className={clsx(
                      "text-sm",
                      {
                        "text-gray-500": theme === "light" || theme === "dark",
                        "text-rose-600": theme === "pastel",
                      }
                    )}>
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className={clsx(
                "text-3xl md:text-4xl font-bold mb-6",
                {
                  "text-gray-900": theme === "light",
                  "text-white": theme === "dark",
                  "text-rose-900": theme === "pastel",
                }
              )}>
                Choose Your Journey
              </h2>
              <p className={clsx(
                "text-lg max-w-2xl mx-auto",
                {
                  "text-gray-600": theme === "light",
                  "text-gray-400": theme === "dark",
                  "text-rose-700": theme === "pastel",
                }
              )}>
                Experience the world&apos;s music with a plan that fits your curiosity.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={clsx(
                    "rounded-2xl p-8 transition-all duration-300 relative",
                    {
                      "border border-gray-200": theme === "light" && !plan.popular,
                      "border border-gray-700": theme === "dark" && !plan.popular,
                      "border border-rose-200": theme === "pastel" && !plan.popular,
                      "border-2 shadow-xl": plan.popular,
                      "border-blue-300 bg-gradient-to-br from-white to-blue-50": plan.popular && theme === "light",
                      "border-indigo-500 bg-gradient-to-br from-gray-900 to-indigo-900/20": plan.popular && theme === "dark",
                      "border-rose-300 bg-gradient-to-br from-rose-50 to-amber-50": plan.popular && theme === "pastel",
                    }
                  )}
                >
                  {plan.popular && (
                    <div className={clsx(
                      "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-2 rounded-full text-sm font-bold",
                      {
                        "bg-blue-600 text-white": theme === "light",
                        "bg-indigo-600 text-white": theme === "dark",
                        "bg-rose-600 text-white": theme === "pastel",
                      }
                    )}>
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className={clsx(
                    "text-2xl font-bold mb-4",
                    {
                      "text-gray-900": theme === "light",
                      "text-white": theme === "dark",
                      "text-rose-900": theme === "pastel",
                    }
                  )}>
                    {plan.name}
                  </h3>
                  
                  <div className="mb-6">
                    <span className={clsx(
                      "text-4xl font-bold",
                      {
                        "text-gray-900": theme === "light",
                        "text-white": theme === "dark",
                        "text-rose-900": theme === "pastel",
                      }
                    )}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={clsx(
                        "text-lg",
                        {
                          "text-gray-600": theme === "light",
                          "text-gray-400": theme === "dark",
                          "text-rose-700": theme === "pastel",
                        }
                      )}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={clsx(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                          {
                            "bg-blue-100 text-blue-600": theme === "light",
                            "bg-indigo-900/50 text-indigo-300": theme === "dark",
                            "bg-rose-100 text-rose-600": theme === "pastel",
                          }
                        )}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={clsx(
                    "w-full py-3 rounded-lg font-bold transition-all",
                    {
                      "bg-blue-600 text-white hover:bg-blue-700": theme === "light" && !plan.popular,
                      "bg-white text-gray-900 hover:bg-gray-100 border border-gray-300": theme === "light" && plan.popular,
                      "bg-indigo-600 text-white hover:bg-indigo-500": theme === "dark" && !plan.popular,
                      "bg-white text-gray-900 hover:bg-gray-100": theme === "dark" && plan.popular,
                      "bg-rose-600 text-white hover:bg-rose-500": theme === "pastel" && !plan.popular,
                      "bg-white text-rose-900 hover:bg-rose-50": theme === "pastel" && plan.popular,
                    }
                  )}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
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
                Begin Your Sonic Journey Today
              </h2>
              <p className="text-xl max-w-2xl mx-auto mb-10 opacity-90">
                Join thousands of explorers discovering the world through its musical heritage.
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
                    Start Free Trial
                  </span>
                </button>
                <button className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold transition-all hover:bg-white/10">
                  Explore Demo
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