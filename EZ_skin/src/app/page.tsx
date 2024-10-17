// pages/index.tsx or pages/homePage.tsx

"use client";

import back from "@/assets/images/home.jpg";
import Chat from "@/components/chat";
import JackpotStatus from "@/components/jacpotStatusapifetch/page"; // Ensure correct path
import JackpotHistory from "@/components/JackpotHistory/jackpotHistory"; // Updated import
import Image from "next/image";

import { useEffect, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import axios, { AxiosResponse } from "axios";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

// Define environment variable for Socket.IO server URL
const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

// Helper function to extract numeric value from a price string (e.g., "12.34 USD" -> 12.34)
const extractPrice = (priceString: string): number => {
  console.log("hello",priceString ,typeof(priceString));
  
  const match = priceString.match(/([\d,.]+)/);
  if (match) {
    return parseFloat(match[1].replace(/,/g, ""));
  }
  return 0;
};

// ----------------------
// Type Definitions
// ----------------------

// Interface for an individual item
interface Item {
  _id: string;
  name: string;
  iconUrl: string;
  price: string; // e.g., "12.34 USD"
  tradable: boolean;
  owner: string;
  assetId: string;
  appId: number;
  contextId: number;
  createdAt: string; // ISO date string
  __v: number;
}

interface User {
  avatar: {
    small: string;
    medium?: string;
    large?: string;
  };
  _id: string;
  steamId: string;
  username: string;
  inventory: string[];
  createdAt: string; // ISO date string
  __v: number;
}

// Interface for participant data received from the server
interface ParticipantData {
  user: User;
  items: Item[];
  color: string; // Added color property
}

// Interface for a participant in the frontend state
interface Participant {
  id: string; // Unique identifier (user ID)
  username: string;
  items: Item[]; // Array of invested items
  totalValue: number;
  skinCount: number;
  img: string;
  color: string; // Color assigned by backend
}

// Interface for the jackpot status response from the server
interface JackpotStatusResponse {
  _id: string;
  participants: ParticipantData[];
}

// Utility to map backend data to frontend Participant structure
const mapParticipants = (participantsData: ParticipantData[]): Participant[] => {
  return participantsData.map((participant) => {
    const user = participant.user;
    const totalValue = participant.items.reduce((acc, item) => {
      const price = extractPrice(item.price);
      return acc + price;
    }, 0);

    return {
      id: user._id, // Ensure 'id' is included
      username: user.username || "Unknown",
      items: participant.items, // Include items
      totalValue: totalValue,
      skinCount: participant.items.length,
      img: user.avatar.small || "/default-avatar.png",
      color: participant.color, // Use color from backend
    };
  });
};

export default function HomePage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roundHash, setRoundHash] = useState<string>("");

  useEffect(() => {
    // Initialize Socket.IO client
    console.log(SOCKET_SERVER_URL);

    const socket: Socket = io(SOCKET_SERVER_URL);

    // Fetch initial jackpot data
    const fetchJackpotData = async () => {
      try {
        const response: AxiosResponse<JackpotStatusResponse> = await axios.get(
          `${SOCKET_SERVER_URL}/jackpotSystem/status`
        );
        const participantsData: ParticipantData[] = response.data.participants;
        const roundHash =  response.data._id
        console.log(participantsData);

        const initialParticipants: Participant[] = mapParticipants(participantsData);
        

        setParticipants(initialParticipants);
        setRoundHash(response.data._id);
      } catch (error: any) {
        console.error(
          "Error fetching jackpot data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchJackpotData();

    // Listen for participants update
    socket.on("participants", (data: JackpotStatusResponse) => {
      fetchJackpotData();
    });

    // Cleanup the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  // Calculate all skins from participants
  const allSkins = useMemo(() => {
    return participants.flatMap((participant) =>
      participant.items.map((item) => ({
        ...item,
        participantColor: participant.color,
        participantImg: participant.img,
        participantUsername: participant.username,
      }))
    );
  }, [participants]);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${back.src})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="w-full h-[95vh] overflow-y-hidden flex"
      >
        {/* Sidebar */}
        <div className="h-[95vh] pt-2 !hidden md:!flex border-r-[1px] border-black items-center flex-col bg-[#2C2C2E] w-10">
          <svg
            width="25px"
            height="25px"
            className="cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 18L20 18"
              stroke="#5B595C"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 12L20 12"
              stroke="#5B595C"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 6L20 6"
              stroke="#5B595C"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Chat Component */}
        <Chat />

        {/* Main Content */}
        <div className="w-full overflow-y-auto h-[95vh] md:h-[90vh] md:w-[80%]">
          {/* Skins Carousel */}
          <div className="w-[90%] mt-8 mx-auto flex gap-3 overflow-x-auto">
            <AnimatePresence initial={false}>
              {allSkins.map((skin) => (
                <motion.div
                  key={skin._id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex items-center justify-center min-w-[150px] w-[150px] border-b-4 border-[1px] border-[#9b9ba1] h-[100px] bg-[#2C2C2E]"
                  style={{ borderBottomColor: skin.participantColor }}
                >
                  <Image
                    alt="User Avatar"
                    src={skin.participantImg}
                    width={20}
                    height={20}
                    className="rounded-full absolute right-1 top-1"
                  />
                  <div className="text-[#EEC475] text-[11px] absolute left-1 top-1">
                    ${extractPrice(skin.price).toFixed(2)}
                  </div>
                  <img
                    src={skin.iconUrl}
                    alt={skin.name}
                    width={62}
                    height={62}
                  />
                  <p className="text-white text-[10px] absolute bottom-0 text-center">
                    {skin.name}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Jackpot Status */}
          <JackpotStatus participants={participants} roundhash={roundHash}/>

          {/* Jackpot History */}
          <JackpotHistory />
        </div>
      </div>
    </>
  );
}
