import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
} from "../services/authService";

import type {
  User,
  LoginRequest,
} from "../types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  /*
   * Ask backend who the current user is.
   *
   * Browser automatically sends:
   *
   * access_token
   * OR
   * requisition_session
   *
   * because Axios uses withCredentials: true.
   */
  const refreshUser = async () => {
    try {
      const response = await getMe();

      if (
        response.authenticated &&
        response.user
      ) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        "Failed to restore authentication",
        error
      );

      setUser(null);
    }
  };

  /*
   * Restore authentication when the application starts.
   */
  useEffect(() => {
    const restore = async () => {
      setIsLoading(true);

      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, []);

  /*
   * Admin login.
   *
   * Backend sets the access_token cookie.
   */
  const login = async (
    credentials: LoginRequest
  ) => {
    const response = await loginRequest(
      credentials
    );

    if (response.role !== "ADMIN") {
      throw new Error(
        "Administrator access required"
      );
    }

    /*
     * Don't manually set the user.
     *
     * /me is the single source of truth.
     */
    await refreshUser();
  };

  /*
   * Logout.
   *
   * Backend removes:
   *
   * access_token
   * requisition_session
   */
  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};