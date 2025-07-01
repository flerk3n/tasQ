import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../services/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('🔐 Starting Firebase Google Sign-In...');
      
      const provider = new GoogleAuthProvider();
      
      // Add scopes for basic profile info
      provider.addScope('profile');
      provider.addScope('email');
      
      // Use Firebase's built-in Google Sign-In
      const result = await signInWithPopup(auth, provider);
      
      console.log('✅ Google Sign-In successful:', result.user.displayName);
      return result;
    } catch (error) {
      console.error('❌ Google Sign-In Error:', error);
      
      // Provide helpful error messages
      if (error.code === 'auth/operation-not-allowed') {
        alert('Google Sign-In is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method → Google');
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log('User closed the popup');
      } else {
        alert(`Sign-in failed: ${error.message}`);
      }
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('✅ Successfully logged out');
    } catch (error) {
      console.error('❌ Logout Error:', error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 