"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "../firebase";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export type Theme = "light" | "dark" | "pastel";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  user: User | null;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const db = typeof window !== "undefined" ? getFirestore() : null;

  // Listen for auth changes and fetch theme
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser && db) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.theme) setThemeState(data.theme);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [db]);

  // Update document class on theme change
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Update Firestore when theme changes
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    if (user && db) {
      await setDoc(doc(db, "users", user.uid), { theme: newTheme }, { merge: true });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, user, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};
