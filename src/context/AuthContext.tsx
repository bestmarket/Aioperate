import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Business } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  activeBusiness: Business | null;
  businesses: Business[];
  loading: boolean;
  isDemoMode: boolean;
  setDemoMode: (val: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (val: boolean) => void;
  switchBusiness: (businessId: string) => Promise<void>;
  createBusiness: (data: Partial<Business>) => Promise<Business>;
  updateActiveBusiness: (data: Partial<Business>) => Promise<void>;
  refreshAuth: (targetBizId?: string) => Promise<void>;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    industry?: string;
    currency?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setDemoMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const refreshAuth = async (targetBizId?: string) => {
    try {
      setLoading(true);
      const data = await api.getAuthMe(targetBizId || activeBusiness?.id);
      setUser(data.user);
      setBusinesses(data.businesses);
      setActiveBusiness(data.activeBusiness);
    } catch (err) {
      console.error('Failed to load auth/tenant data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const switchBusiness = async (businessId: string) => {
    const selected = businesses.find((b) => b.id === businessId);
    if (selected) {
      setActiveBusiness(selected);
      await refreshAuth(businessId);
    }
  };

  const createBusiness = async (data: Partial<Business>): Promise<Business> => {
    const newBiz = await api.createBusiness(data);
    setBusinesses((prev) => [...prev, newBiz]);
    setActiveBusiness(newBiz);
    return newBiz;
  };

  const updateActiveBusiness = async (data: Partial<Business>) => {
    if (!activeBusiness) return;
    const updated = await api.updateBusiness(activeBusiness.id, data);
    setActiveBusiness(updated);
    setBusinesses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      setUser(data.user);
      setActiveBusiness(data.business);
      if (data.business && !businesses.some((b) => b.id === data.business.id)) {
        setBusinesses((prev) => [data.business, ...prev]);
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: {
    name: string;
    email: string;
    password?: string;
    companyName: string;
    industry?: string;
    currency?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      setActiveBusiness(data.business);
      setBusinesses((prev) => [data.business, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Reset to default guest or clear
    if (businesses[0]) {
      setActiveBusiness(businesses[0]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeBusiness,
        businesses,
        loading,
        isDemoMode,
        setDemoMode,
        showOnboarding,
        setShowOnboarding,
        switchBusiness,
        createBusiness,
        updateActiveBusiness,
        refreshAuth,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
