import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'phd_candidate' | 'masters' | 'postdoc' | 'faculty' | 'other';
  researchField?: string;
  researchArea?: string;
  researchTopics?: string[];
  verified: boolean;
  orcidId?: string;
  googleScholarConnected?: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithProvider: (provider: 'google-scholar' | 'orcid' | 'institution') => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  completeOnboarding: (data: OnboardingData) => Promise<void>;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role: User['role'];
  researchField?: string;
  agreedToTerms: boolean;
  marketingOptIn: boolean;
}

interface OnboardingData {
  researchField: string;
  researchArea?: string;
  researchTopics: string[];
  currentStage: string;
  firstProjectName: string;
  researchQuestion?: string;
  projectGoal: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('phd_reader_user');
    const token = localStorage.getItem('phd_reader_token');
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock login validation
    if (email === 'demo@stanford.edu' && password === 'password') {
      const mockUser: User = {
        id: '1',
        email: 'demo@stanford.edu',
        fullName: 'Sarah Chen',
        role: 'phd_candidate',
        researchField: 'Computer Science',
        researchArea: 'Machine Learning',
        researchTopics: ['deep learning', 'transformers', 'NLP'],
        verified: true,
        orcidId: '0000-0002-1825-0097',
        googleScholarConnected: true,
      };

      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('phd_reader_user', JSON.stringify(mockUser));
      localStorage.setItem('phd_reader_token', token);
      
      if (rememberMe) {
        localStorage.setItem('phd_reader_remember', 'true');
      }

      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const loginWithProvider = async (provider: 'google-scholar' | 'orcid' | 'institution') => {
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockUser: User = {
      id: '1',
      email: 'demo@stanford.edu',
      fullName: 'Sarah Chen',
      role: 'phd_candidate',
      researchField: 'Computer Science',
      verified: true,
      googleScholarConnected: provider === 'google-scholar',
      orcidId: provider === 'orcid' ? '0000-0002-1825-0097' : undefined,
    };

    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('phd_reader_user', JSON.stringify(mockUser));
    localStorage.setItem('phd_reader_token', token);
    setUser(mockUser);
  };

  const signup = async (data: SignupData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      researchField: data.researchField,
      verified: false, // Requires email verification
    };

    const token = 'mock_jwt_token_' + Date.now();
    localStorage.setItem('phd_reader_user', JSON.stringify(newUser));
    localStorage.setItem('phd_reader_token', token);
    localStorage.setItem('phd_reader_needs_onboarding', 'true');
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('phd_reader_user');
    localStorage.removeItem('phd_reader_token');
    localStorage.removeItem('phd_reader_remember');
    localStorage.removeItem('phd_reader_needs_onboarding');
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, would call API to send reset email
  };

  const updatePassword = async (token: string, newPassword: string) => {
    // Simulate password update
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, would validate token and update password
  };

  const verifyEmail = async (token: string) => {
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (user) {
      const updatedUser = { ...user, verified: true };
      localStorage.setItem('phd_reader_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const resendVerification = async () => {
    // Simulate resending verification email
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const updateProfile = async (data: Partial<User>) => {
    // Simulate profile update
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('phd_reader_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const completeOnboarding = async (data: OnboardingData) => {
    // Simulate onboarding completion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser: User = {
        ...user,
        researchField: data.researchField,
        researchArea: data.researchArea,
        researchTopics: data.researchTopics,
      };
      localStorage.setItem('phd_reader_user', JSON.stringify(updatedUser));
      localStorage.removeItem('phd_reader_needs_onboarding');
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithProvider,
        signup,
        logout,
        resetPassword,
        updatePassword,
        verifyEmail,
        resendVerification,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
