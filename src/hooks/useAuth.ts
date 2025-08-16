'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isNewUser: boolean;
  hasCompletedOnboarding: boolean;
  logout: () => Promise<void>;
  setHasCompletedOnboarding: (value: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isNewUser: false,
  hasCompletedOnboarding: false,
  logout: async () => {},
  setHasCompletedOnboarding: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setIsLoading(false);

      if (user) {
        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!userDoc.exists()) {
          // New user, needs to complete onboarding
          setIsNewUser(true);
          setHasCompletedOnboardingState(false);
          
          // Create basic user document
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date().toISOString(),
            hasCompletedOnboarding: false,
          });
        } else {
          // Existing user
          setIsNewUser(false);
          setHasCompletedOnboardingState(userDoc.data()?.hasCompletedOnboarding || false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const setHasCompletedOnboarding = async (value: boolean) => {
    if (user) {
      await setDoc(doc(db, 'users', user.uid), { hasCompletedOnboarding: value }, { merge: true });
      setHasCompletedOnboardingState(value);
    }
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isNewUser,
    hasCompletedOnboarding,
    logout,
    setHasCompletedOnboarding,
  };

  console.log('authContextValue:', authContextValue);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);