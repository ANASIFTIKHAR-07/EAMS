import React, { useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import axios from "axios";
import { toast } from "react-toastify";
import { data } from "@app/_components/widgets/NewAuthors/data";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [userLoading, setUserLoading] = React.useState(false);
  const [loggedInUser,setLoggedInUser] = React.useState({})


  const fetchLoggedInUser = async () => {
    setUserLoading(true);
    try {
      const response = await axios.get("http://localhost:7000/api/v1/auth/me", {
        withCredentials: true,
      });
  
      const user = response.data?.message;
      if (user) {
        setLoggedInUser(user);
        setUser(user); // optional if needed
        setIsAuthenticated(true);
        console.log("✅ Logged-in user:", user);
        return user;
      } else {
        throw new Error("User object not found in response");
      }
    } catch (error) {
      console.error("❌ Error in fetchLoggedInUser:", error);
      setLoggedInUser(null);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setUserLoading(false);
    }
  };
  
  // Fetch user data from API
  const fetchUser = async () => {
    setUserLoading(true);
    try {
      const response = await axios.get("http://localhost:7000/api/v1/auth/me", {
        withCredentials: true,
      });

      if (response.data?.data) {
        setUser(response.data.data);
        return response.data.data;
      }
    } catch (error) {
      console.error("fetchUser error:", error?.response?.data);

      if (error?.response?.data?.message === "jwt expired") {
        try {
          await axios.post(
            "http://localhost:7000/api/v1/auth/refresh-tokens",
            {},
            { withCredentials: true }
          );

          const retryResponse = await axios.get(
            "http://localhost:7000/api/v1/auth/me",
            { withCredentials: true }
          );

          if (retryResponse.data?.data) {
            setUser(retryResponse.data.data);
            setIsAuthenticated(true);
            return retryResponse.data.data;
          }
        } catch (refreshError) {
          console.log("Token refresh failed:", refreshError);
          setIsAuthenticated(false);
          setUser(null);
          return null;
        }
      }

      setIsAuthenticated(false);
      setUser(null);
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  const updateUser = (updatedUser) => setUser(updatedUser);
  const refreshUser = async () => await fetchUser();

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { message } = response.data;
      if (message?.refreshToken) {
        const stringify = {
          token: message.refreshToken,
          email: message.loggedInUser?.email,
        };
        const authUserSr = encodeURIComponent(JSON.stringify(stringify));
        setCookie("token", authUserSr, 1);
        setIsAuthenticated(true);
        setUser(message.loggedInUser);

        await fetchUser();

        const role = message.loggedInUser?.role;
        if (role === "admin") {
          window.location.href = "/admin/dashboard";
        } else if (role === "employee") {
          window.location.href = "/employee/dashboard"; 
        }

        toast.success("Login successful! Welcome back!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        return message;
      } else {
        return false;
      }
    } catch (error) {
      setIsAuthenticated(false);

      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        eraseCookie("token");
        setIsAuthenticated(false);
        setUser(null);

        toast.info("Logged out successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie("token");
      if (token) {
        await fetchLoggedInUser();
      }
      setLoading(false);
    };
  
    initializeAuth();
  }, []);
  

  

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
        loggedInUser,
        fetchLoggedInUser,
        setIsAuthenticated,
        user,
        userLoading,
        fetchUser,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
