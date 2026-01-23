import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
  const { user, login, logout } = useAuthContext();
  // We can add derived state here (like isAuthenticated) 
  // so components don't have to calculate it themselves.
  return { 
    isAuthenticated: !!user, 
    user, 
    login, 
    logout 
  };
}