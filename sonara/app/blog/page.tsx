// app/blog/page.tsx
'use client';

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  BookOpen, 
  Users, 
  Clock, 
  Tag, 
  Calendar,
  ArrowRight,
  Play,
  ChevronRight
} from "lucide-react";
import clsx from "clsx";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ThemeToggle from "../../components/ThemeToggle";
import LoginButton from "../../components/LoginButton";
import { useThemeContext } from "../../components/ThemeContext";
import NavBar from "../../components/NavBar";

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  category: string;
  featured?: boolean;
};

export default function BlogPage() {
  const { theme, setTheme } = useThemeContext();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTag, setActiveTag] = useState("");
  const [loading, setLoading] = useState(true);
  const db = typeof window !== "undefined" ? getFirestore() : null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && db) {
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

  // Simulate data loading
  useEffect(() => {
    setTimeout(() => {
      setPosts(generateBlogPosts());
      setLoading(false);
    }, 800);
  }, []);

  // Wrap filterPosts in useCallback to prevent it from changing on every render
  const filterPosts = useCallback(() => {
    let result = [...posts];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (activeCategory !== "All") {
      result = result.filter(post => post.category === activeCategory);
    }
    
    // Apply tag filter
    if (activeTag) {
      result = result.filter(post => post.tags.includes(activeTag));
    }
    
    setFilteredPosts(result);
  }, [posts, searchQuery, activeCategory, activeTag]);

  useEffect(() => {
    document.documentElement.className = theme;
    filterPosts();
  }, [posts, searchQuery, activeCategory, activeTag, theme, filterPosts]);

  const generateBlogPosts = (): BlogPost[] => {
    return [
      {
        id: "1",
        title: "The Last Tuvan Throat Singers: Preserving an Ancient Art",
        excerpt: "How Mongolian nomads are keeping their unique vocal traditions alive in the modern world.",
        date: "May 15, 2024",
        readTime: "8 min read",
        author: "Dr. Elena Rodriguez",
        tags: ["Vocal", "Mongolia", "Endangered", "Tradition"],
        category: "Cultural Heritage",
        featured: true
      },
      {
        id: "2",
        title: "Interview with Mali's Kora Master: Toumani Diabaté",
        excerpt: "A conversation with the Grammy-winning artist about tradition and innovation in West African music.",
        date: "April 28, 2024",
        readTime: "12 min read",
        author: "James Chen",
        tags: ["Interview", "Mali", "Kora", "Innovation"],
        category: "Artist Spotlight"
      },
      {
        id: "3",
        title: "The Silk Road's Musical Legacy: From Persia to China",
        excerpt: "Tracing the exchange of instruments and melodies along history's greatest trade route.",
        date: "April 12, 2024",
        readTime: "10 min read",
        author: "Dr. Amir Khan",
        tags: ["History", "Silk Road", "Instruments", "Cultural Exchange"],
        category: "Historical Context"
      },
      {
        id: "4",
        title: "Field Notes: Recording the Rainforest's Soundscape",
        excerpt: "An audio ethnographer's journey deep into the Amazon to capture vanishing soundscapes.",
        date: "March 30, 2024",
        readTime: "6 min read",
        author: "Aisha N'Doye",
        tags: ["Field Recording", "Amazon", "Nature", "Endangered"],
        category: "Audio Ethnography"
      },
      {
        id: "5",
        title: "The Rebirth of Baltic Folk Music After Soviet Rule",
        excerpt: "How Estonia, Latvia, and Lithuania revived their musical traditions post-independence.",
        date: "March 18, 2024",
        readTime: "9 min read",
        author: "Olaf Petersen",
        tags: ["Baltic", "Revival", "Folk", "History"],
        category: "Cultural Heritage"
      },
      {
        id: "6",
        title: "Didgeridoo in the Digital Age: Blending Tradition with Technology",
        excerpt: "Australian Aboriginal artists are creating new forms of expression with ancient instruments.",
        date: "March 5, 2024",
        readTime: "7 min read",
        author: "Marcus Johnson",
        tags: ["Australia", "Innovation", "Didgeridoo", "Technology"],
        category: "Artist Spotlight"
      },
      {
        id: "7",
        title: "The Lost Harps of Ireland: A Reconstruction Journey",
        excerpt: "Archaeologists and musicians collaborate to recreate ancient Celtic harps.",
        date: "February 22, 2024",
        readTime: "11 min read",
        author: "Priya Sharma",
        tags: ["Ireland", "Archaeology", "Reconstruction", "Harp"],
        category: "Historical Context"
      },
      {
        id: "8",
        title: "Women of Gnawa: Breaking Gender Barriers in Moroccan Ritual Music",
        excerpt: "The rising female artists transforming a traditionally male-dominated spiritual tradition.",
        date: "February 8, 2024",
        readTime: "8 min read",
        author: "Malia Chen",
        tags: ["Morocco", "Gender", "Spiritual", "Gnawa"],
        category: "Cultural Heritage"
      },
      {
        id: "9",
        title: "Audio Documentary: The Whale Songs of Polynesian Navigation",
        excerpt: "How ancient Pacific navigators used cetacean vocalizations as sonic guides.",
        date: "January 25, 2024",
        readTime: "14 min read",
        author: "Kwame Johnson",
        tags: ["Polynesia", "Navigation", "Nature", "Documentary"],
        category: "Audio Ethnography",
        featured: true
      }
    ];
  };

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategory("All");
    setActiveTag("");
  };

  const categories = ["All", "Cultural Heritage", "Artist Spotlight", "Historical Context", "Audio Ethnography"];
  
  // Extract all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

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
                <BookOpen className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
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
            {/* Main Content - 3/4 width */}
            <div className="lg:w-3/4">
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
                  Insights & Stories
                </h1>
                <p className={clsx(
                  "text-lg",
                  {
                    "text-gray-600": theme === "light",
                    "text-gray-400": theme === "dark",
                    "text-rose-700": theme === "pastel",
                  }
                )}>
                  Discover the stories behind the world&apos;s musical traditions
                </p>
              </div>
              
              {/* Featured Post */}
              {!loading && filteredPosts.filter(p => p.featured).length > 0 && (
                <div className={clsx(
                  "rounded-2xl overflow-hidden mb-8",
                  {
                    "bg-white border border-gray-200": theme === "light",
                    "bg-gray-800 border border-gray-700": theme === "dark",
                    "bg-white border border-rose-200": theme === "pastel",
                  }
                )}>
                  {filteredPosts.filter(p => p.featured).map(featuredPost => (
                    <div key={featuredPost.id} className="flex flex-col md:flex-row">
                      <div className="md:w-1/2 bg-gray-200 border-2 border-dashed min-h-[300px]" />
                      <div className="p-6 md:w-1/2">
                        <div className={clsx(
                          "inline-block px-3 py-1 rounded-full mb-4 text-sm font-medium",
                          {
                            "bg-blue-100 text-blue-800": theme === "light",
                            "bg-indigo-900/50 text-indigo-200": theme === "dark",
                            "bg-rose-100 text-rose-800": theme === "pastel",
                          }
                        )}>
                          Featured Story
                        </div>
                        <h2 className={clsx(
                          "text-2xl font-bold mb-4",
                          {
                            "text-gray-900": theme === "light",
                            "text-white": theme === "dark",
                            "text-rose-900": theme === "pastel",
                          }
                        )}>
                          {featuredPost.title}
                        </h2>
                        <p className={clsx(
                          "mb-6",
                          {
                            "text-gray-600": theme === "light",
                            "text-gray-400": theme === "dark",
                            "text-rose-700": theme === "pastel",
                          }
                        )}>
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 opacity-70" />
                            <span>{featuredPost.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 opacity-70" />
                            <span>{featuredPost.readTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 opacity-70" />
                            <span>{featuredPost.author}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {featuredPost.tags.map(tag => (
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
                        <button className={clsx(
                          "flex items-center gap-2 font-medium group",
                          {
                            "text-blue-600": theme === "light",
                            "text-indigo-400": theme === "dark",
                            "text-rose-600": theme === "pastel",
                          }
                        )}>
                          Read Full Story
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Category Filter */}
              <div className={clsx(
                "flex overflow-x-auto gap-2 mb-8 pb-2",
                {
                  "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100": theme === "light",
                  "scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900": theme === "dark",
                  "scrollbar-thin scrollbar-thumb-rose-300 scrollbar-track-rose-100": theme === "pastel",
                }
              )}>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={clsx(
                      "px-4 py-2 rounded-lg whitespace-nowrap flex-shrink-0 transition-all",
                      {
                        "bg-blue-600 text-white": activeCategory === category && theme === "light",
                        "bg-gray-100 text-gray-800": activeCategory !== category && theme === "light",
                        "bg-indigo-600 text-white": activeCategory === category && theme === "dark",
                        "bg-gray-800 text-gray-300": activeCategory !== category && theme === "dark",
                        "bg-rose-600 text-white": activeCategory === category && theme === "pastel",
                        "bg-rose-100 text-rose-800": activeCategory !== category && theme === "pastel",
                      }
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              {/* Blog Posts Grid */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className={clsx(
                  "text-center py-16 rounded-xl",
                  {
                    "bg-white border border-gray-200": theme === "light",
                    "bg-gray-800 border border-gray-700": theme === "dark",
                    "bg-white border border-rose-200": theme === "pastel",
                  }
                )}>
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold mb-2">No Articles Found</h3>
                  <p className="opacity-75 mb-4">Try adjusting your filters or search query</p>
                  <button 
                    onClick={clearFilters}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPosts.filter(p => !p.featured).map(post => (
                    <div 
                      key={post.id}
                      className={clsx(
                        "rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 group",
                        {
                          "bg-white border border-gray-200 shadow-sm": theme === "light",
                          "bg-gray-800 border border-gray-700": theme === "dark",
                          "bg-white border border-rose-200": theme === "pastel",
                        }
                      )}
                    >
                      <div className="bg-gray-200 border-2 border-dashed h-48" />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={clsx(
                            "px-3 py-1 rounded-full text-sm font-medium",
                            {
                              "bg-blue-100 text-blue-800": theme === "light",
                              "bg-indigo-900/50 text-indigo-200": theme === "dark",
                              "bg-rose-100 text-rose-800": theme === "pastel",
                            }
                          )}>
                            {post.category}
                          </div>
                          <div className="flex items-center gap-1 text-sm opacity-70">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        
                        <h3 className={clsx(
                          "text-xl font-bold mb-3 group-hover:underline",
                          {
                            "text-gray-900": theme === "light",
                            "text-white": theme === "dark",
                            "text-rose-900": theme === "pastel",
                          }
                        )}>
                          {post.title}
                        </h3>
                        
                        <p className={clsx(
                          "mb-4",
                          {
                            "text-gray-600": theme === "light",
                            "text-gray-400": theme === "dark",
                            "text-rose-700": theme === "pastel",
                          }
                        )}>
                          {post.excerpt}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 opacity-70" />
                            <span>{post.date}</span>
                            <span className="opacity-50">•</span>
                            <Users className="w-4 h-4 opacity-70" />
                            <span>{post.author}</span>
                          </div>
                          
                          <button className={clsx(
                            "flex items-center gap-1 text-sm font-medium group",
                            {
                              "text-blue-600": theme === "light",
                              "text-indigo-400": theme === "dark",
                              "text-rose-600": theme === "pastel",
                            }
                          )}>
                            Read more
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sidebar - 1/4 width */}
            <div className="lg:w-1/4">
              {/* Search Bar */}
              <div className={clsx(
                "rounded-2xl overflow-hidden mb-6",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-4">Search Articles</h3>
                  <div className={clsx(
                    "relative",
                    {
                      "text-gray-600": theme === "light",
                      "text-gray-400": theme === "dark",
                      "text-rose-700": theme === "pastel",
                    }
                  )}>
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={clsx(
                        "w-full pl-10 pr-4 py-3 rounded-lg",
                        {
                          "bg-gray-50 border border-gray-200": theme === "light",
                          "bg-gray-700 border border-gray-600": theme === "dark",
                          "bg-rose-50 border border-rose-200": theme === "pastel",
                        }
                      )}
                    />
                  </div>
                </div>
              </div>
              
              {/* Tags Cloud */}
              <div className={clsx(
                "rounded-2xl overflow-hidden mb-6",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Tag className="w-5 h-5" /> Popular Tags
                    </h3>
                    {activeTag && (
                      <button 
                        onClick={() => setActiveTag("")}
                        className="text-sm opacity-70 hover:opacity-100"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                        className={clsx(
                          "px-3 py-1 rounded-full text-sm transition-all",
                          {
                            "bg-blue-100 text-blue-800": theme === "light" && activeTag === tag,
                            "bg-gray-100 text-gray-800": theme === "light" && activeTag !== tag,
                            "bg-indigo-900/50 text-indigo-200": theme === "dark" && activeTag === tag,
                            "bg-gray-700 text-gray-300": theme === "dark" && activeTag !== tag,
                            "bg-rose-100 text-rose-800": theme === "pastel" && activeTag === tag,
                            "bg-rose-50 text-rose-700": theme === "pastel" && activeTag !== tag,
                          }
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Audio Features */}
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
                  <h3 className="text-lg font-bold">Audio Features</h3>
                  <p className="opacity-90">Listen to our immersive audio documentaries</p>
                </div>
                
                <div className="p-5">
                  <div className="space-y-4">
                    {[
                      {
                        title: "Whispers of the Sahara",
                        duration: "24 min",
                        description: "Nomadic music traditions of the Tuareg people"
                      },
                      {
                        title: "Echoes from the Andes",
                        duration: "32 min",
                        description: "Panpipe melodies across mountain villages"
                      },
                      {
                        title: "Tokyo Soundscapes",
                        duration: "28 min",
                        description: "Urban sound culture in modern Japan"
                      }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-4 group cursor-pointer"
                      >
                        <div className={clsx(
                          "w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0",
                          {
                            "bg-blue-100 text-blue-600": theme === "light",
                            "bg-indigo-900/50 text-indigo-300": theme === "dark",
                            "bg-rose-100 text-rose-600": theme === "pastel",
                          }
                        )}>
                          <Play className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold truncate">{feature.title}</h4>
                          <p className="text-sm opacity-70 truncate">{feature.description}</p>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{feature.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Newsletter */}
              <div className={clsx(
                "rounded-2xl overflow-hidden",
                {
                  "bg-white border border-gray-200": theme === "light",
                  "bg-gray-800 border border-gray-700": theme === "dark",
                  "bg-white border border-rose-200": theme === "pastel",
                }
              )}>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
                  <p className={clsx(
                    "mb-4",
                    {
                      "text-gray-600": theme === "light",
                      "text-gray-400": theme === "dark",
                      "text-rose-700": theme === "pastel",
                    }
                  )}>
                    Get the latest articles and audio features delivered to your inbox
                  </p>
                  
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className={clsx(
                        "w-full px-4 py-3 rounded-lg",
                        {
                          "bg-gray-50 border border-gray-200": theme === "light",
                          "bg-gray-700 border border-gray-600": theme === "dark",
                          "bg-rose-50 border border-rose-200": theme === "pastel",
                        }
                      )}
                    />
                    <button className={clsx(
                      "w-full py-3 rounded-lg font-bold",
                      {
                        "bg-blue-600 text-white hover:bg-blue-700": theme === "light",
                        "bg-indigo-600 text-white hover:bg-indigo-500": theme === "dark",
                        "bg-rose-600 text-white hover:bg-rose-500": theme === "pastel",
                      }
                    )}>
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}