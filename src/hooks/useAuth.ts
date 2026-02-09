import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const { user, session, isLoading, logout } = useAuthContext();
  
  return { 
    isAuthenticated: !!user, 
    user, 
    session,
    isLoading,
    logout 
  };
}