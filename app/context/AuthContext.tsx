"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

type AuthContextType = {
  user: User | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  register: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===== AUTH STATE ===== */

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      setUser(firebaseUser);

      if (firebaseUser) {

        try {

          const userRef = doc(db, "users", firebaseUser.uid);

          const snap = await getDoc(userRef);

          if (snap.exists()) {

            setRole(snap.data().role || "user");

          } else {

            setRole("user");

          }

        } catch (error) {

          console.error("Role fetch error:", error);

          setRole("user");

        }

      } else {

        setRole(null);

      }

      setLoading(false);

    });

    return () => unsubscribe();

  }, []);

  /* ===== REGISTER ===== */

  const register = async (email: string, password: string) => {

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    try {

      await setDoc(doc(db, "users", user.uid), {

        email,
        role: "user",
        emailVerified: false,
        createdAt: new Date()

      });

    } catch (error) {

      console.error("User creation error:", error);

    }

    return userCredential;

  };

  /* ===== LOGIN ===== */

  const login = async (email: string, password: string) => {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const userRef = doc(db, "users", userCredential.user.uid);

    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {

      await signOut(auth);

      throw new Error("USER_DATA_NOT_FOUND");

    }

    if (!userDoc.data()?.emailVerified) {

      await signOut(auth);

      throw new Error("EMAIL_NOT_VERIFIED");

    }

    return userCredential;

  };

  /* ===== LOGOUT ===== */

  const logout = async () => {

    await signOut(auth);

  };

  /* ===== RESET PASSWORD ===== */

  const resetPassword = async (email: string) => {

    await sendPasswordResetEmail(auth, email);

  };

  return (

    <AuthContext.Provider

      value={{
        user,
        role,
        loading,
        login,
        register,
        logout,
        resetPassword
      }}

    >

      {children}

    </AuthContext.Provider>

  );

}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error("useAuth must be inside AuthProvider");

  }

  return context;

}