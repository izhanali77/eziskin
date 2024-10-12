"use client";
import React, { useEffect, useState } from "react";
import AccountSetting from "@/components/Header/iconsdropdown";
import LogoutIcon from "@mui/icons-material/Logout";

const SteamLogin: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [steamID64, setSteamID64] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const steamIDFromURL = urlParams.get("steamID64");
    const usernameFromURL = urlParams.get("username");
    const avatarString = urlParams.get("avatar");

    if (avatarString) {
      const parsedAvatars = JSON.parse(avatarString);
      const { small, medium, large } = parsedAvatars;
      setAvatar(large);
    }

    if (steamIDFromURL && usernameFromURL) {
      localStorage.setItem("steamID64", steamIDFromURL);
      localStorage.setItem("username", usernameFromURL);
      setIsLoggedIn(true);
      setUsername(usernameFromURL);
      setSteamID64(steamIDFromURL);
      fetchSteamProfile(steamIDFromURL);
    } else {
      const storedSteamID64 = localStorage.getItem("steamID64");
      const storedUsername = localStorage.getItem("username");

      if (storedSteamID64 && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
        setSteamID64(storedSteamID64);
        fetchSteamProfile(storedSteamID64);
      }
    }
  }, []);

  const fetchSteamProfile = async (steamID64: string) => {
    try {
      const response = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=1E0DDC6BB18FAAAE89D3D06505AC82A1&steamids=${steamID64}`,
      );
      const data = await response.json();
      const player = data.response.players[0];
      setAvatar(player.avatarfull);
    } catch (error) {
      console.error("Error fetching Steam profile:", error);
    }
  };

  const handleLogin = () => {
    try {
      window.location.href = `${SOCKET_SERVER_URL}/auth/steam`; // Correct URL with http
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("steamID64");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setSteamID64("");
    setAvatar("");
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
          <AccountSetting user={username} userProfile={avatar} />
          {/* <img src={avatar} alt="Steam Avatar" className="w-10 h-10 rounded-full" /> */}
          <a href="http://localhost:5000/logout">
            <button id="logoutButton" onClick={handleLogout}>
              <LogoutIcon htmlColor="white" />
            </button>
          </a>
        </div>
      )}
    </div>
  );
};

export default SteamLogin;
