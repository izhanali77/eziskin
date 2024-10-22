"use client";
import React, { useEffect } from "react";
import AccountSetting from "@/components/Header/iconsdropdown";
import LogoutIcon from "@mui/icons-material/Logout";
import { useUserContext } from '@/context/UserContext';

const SteamLogin: React.FC = () => {
  const { isLoggedIn, setUsername, setAvatar, setSteamId64, setIsLoggedIn } = useUserContext();
  const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
          method: 'GET',
          credentials: 'include', // Ensures the cookie is sent with the request
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("hello",userData);
          
          // setUsername(userData.username);
          // setAvatar(userData.avatar.large);
          // setSteamId64(userData.steamID64);
          // setIsLoggedIn(true);
        } else {
          console.log("User is not logged in or error occurred.");
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
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div>
      {!isLoggedIn ? (
        <button id="loginButton" onClick={handleLogin}>
          <img
            src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png"
            alt="steam login"
          />
        </button>
      ) : (
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

   

    // useEffect(() => {
    //   // Function to fetch the specific cookie by name
    //   const getCookieByName = (name : string) => {
    //     const cookieArr = document.cookie.split(';');
    //     for (let i = 0; i < cookieArr.length; i++) {
    //       const cookiePair = cookieArr[i].split('=');
    //       if (name === cookiePair[0].trim()) {
    //         return decodeURIComponent(cookiePair[1]);
    //       }
    //     }
    //     return null;
    //   };
    
    //   // Function to delete the cookie from the browser
    //   const deleteCookie = (name : string) => {
    //     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    //   };
    
    //   // Fetch user info securely from the server
    //   const fetchUserInfo = async () => {
    //     try {
    //       console.log("SOCKET_SERVER_URL", document.cookie);
    
    //       const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
    //         method: 'GET',
    //         credentials: 'include', // This ensures the cookie is sent with the request
    //       });
    
    //       if (response.ok) {
    //         const userData = await response.json();
    //         setUsername(userData.username);
    //         setAvatar(userData.avatar.large);
    //         setSteamId64(userData.steamID64);
    //         setIsLoggedIn(true);
    //         console.log(userData);
    
    //         // Fetch the 'FBI' cookie
    //         const fbiCookie = getCookieByName('FBI');
    //         console.log('FBI Cookie:', fbiCookie);
    
    //         // Store the FBI cookie in a variable
    //         if (fbiCookie) {
    //           // Store FBI cookie in a variable
    //           const storedFbiCookie = fbiCookie;
    //           console.log('Stored FBI Cookie:', storedFbiCookie);
    
    //           // Delete the cookie from the browser
    //           deleteCookie('FBI');
    //           console.log('FBI Cookie deleted');
    //         } else {
    //           console.log('FBI Cookie not found');
    //         }
    //       } else {
    //         console.log('User is not logged in.');
    //       }
    //     } catch (error) {
    //       console.error('Error fetching user info:', error);
    //     }
    //   };
    
    //   fetchUserInfo();
    // }, []);
 

    // useEffect(() => {
    //   // Fetch user info securely from the server
    //   const fetchUserInfo = async () => {
    //     try {
    //       console.log("SOCKET_SERVER_URL",document.cookie);
          
    //       const response = await fetch(`${SOCKET_SERVER_URL}/api/user`, {
    //         method: 'GET',
    //         credentials: 'include' // This ensures the cookie is sent with the request
    //       });
    
    //       if (response.ok) {
    //         const userData = await response.json();
    //         setUsername(userData.username);
    //         setAvatar(userData.avatar.large);
    //         setSteamId64(userData.steamID64);
    //         setIsLoggedIn(true);
    //         console.log(userData);
    //       } else {
    //         console.log("User is not logged in.");
    //       }
    //     } catch (error) {
    //       console.error("Error fetching user info:", error);
    //     }
    //   };
    
    //     fetchUserInfo();
    
    // }, []);
    