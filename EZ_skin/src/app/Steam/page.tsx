"use client";
import React, { useEffect, useState } from "react";
import AccountSetting from "@/components/Header/iconsdropdown";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserContext } from '@/context/UserContext';

const SteamLogin: React.FC = () => {
  const { isLoggedIn } = useUserContext()
  const { setUsername, setAvatar, setSteamId64, setIsLoggedIn } = useUserContext();
  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    // Fetch user info securely from the server
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user`, {
          method: 'GET',
          credentials: 'include' // This ensures the cookie is sent with the request
        });
        

        if (response.ok) {
          const userData = await response.json();
          setUsername(userData.username);
          setAvatar(userData.avatar.large);
          setSteamId64(userData.steamID64);
          setIsLoggedIn(true);
          console.log(userData);
          
          
        } else {
          console.log("User is not logged in.");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogin = () => {
    window.location.href = `${SOCKET_SERVER_URL}/auth/steam`;
  };

  const handleLogout = async () => {
    try {
      await fetch(`${SOCKET_SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // Include cookie to ensure server knows the user
      });
      setIsLoggedIn(false);
      setUsername("");
      setAvatar("");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      {!isLoggedIn && (
        <div>
          <button id="loginButton" onClick={handleLogin}>
            <img
              src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
              alt="steam login"
            />
          </button>
        </div>
      )}
      {isLoggedIn && (
        <div className="flex gap-x-8 items-center">
          <AccountSetting />
          <button id="logoutButton" onClick={handleLogout}>
            <LogoutIcon htmlColor="white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SteamLogin;
