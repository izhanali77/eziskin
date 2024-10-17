// components/JackpotStatus.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import axios, { AxiosResponse } from "axios";
import Image from "next/image";
import styled from "styled-components";
import { motion } from "framer-motion";

import HorizontalWheel from "../wheel/index"; // Ensure correct path
import TimerBox from "../timer/timer"; // Ensure correct path
import Modal from "../ModalInventory"; // Import the Modal component

// Define environment variable for Socket.IO server URL
const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

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

// Interface for winner data received from the server
interface WinnerData {
  id: string;
  username: string;
  items: Item[];
  totalValue: number;
  skinCount: number;
  img: string;
  color: string;
}

// Interface for the round result received from the server
interface RoundResult {
  winner: WinnerData;
}

// Interface for the jackpot status response from the server
interface JackpotStatusResponse {
  _id: string;
  participants: ParticipantData[];
}

// Interface for the spin event received from the server
interface SpinEventData {
  winnerId: WinnerData;
  startTime: number; // Unix timestamp in milliseconds
  duration: number; // Spin duration in milliseconds
}

// WinnerAnnouncement Styled Component
const WinnerAnnouncement = styled(motion.div)<{ bgColor: string }>`
  width: 100%;
  background-color: ${({ bgColor }) => bgColor || "#000"};
  padding: 20px;
  color: #fff;
  margin-top: 20px; /* Space above the announcement */
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Moving Diagonal Stripe Pattern */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%; /* Ensure the stripes cover the full width */
    height: 200%; /* Ensure the stripes cover the full height */
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
    );
    background-size: 20px 20px; /* Adjust the size of the diagonal stripes */
    pointer-events: none; /* Allows clicks to pass through to underlying elements */
    animation: moveBackground 2s linear infinite;
  }

  @keyframes moveBackground {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 40px 40px;
    }
  }

  .content {
    position: relative;
    z-index: 1;
    font-size: 1.5rem;
    font-weight: bold;
  }
`;

// ----------------------
// JackpotStatus Component
// ----------------------

interface JackpotStatusProps {
  roundhash: string;
  participants: Participant[];
}

export default function JackpotStatus({ participants, roundhash }: JackpotStatusProps) {
  const [winner, setWinner] = useState<Participant | null>(null);
  const [spinDuration, setSpinDuration] = useState<number>(5000); // Default to 5 seconds
  // const [roundHash, setRoundHash] = useState<string>("");
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState(false);

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL);

    // // Fetch initial jackpot data
    // const fetchJackpotData = async () => {
    //   try {
    //     const response: AxiosResponse<JackpotStatusResponse> = await axios.get(
    //       `${SOCKET_SERVER_URL}/jackpotSystem/status`
    //     );
    //     const participantsData: ParticipantData[] = response.data.participants;
    //     setRoundHash(response.data._id);
    //   } catch (error: any) {
    //     console.error(
    //       "Error fetching jackpot data:",
    //       error.response ? error.response.data : error.message
    //     );
    //   }
    // };

    // fetchJackpotData();

    // Listen for round result
    socket.on("roundResult", (data: RoundResult) => {
      const winnerData = data.winner;

      // Directly set the winner since the structure matches Participant
      const winnerParticipant: Participant = {
        id: winnerData.id,
        username: winnerData.username || "Unknown",
        items: winnerData.items,
        totalValue: winnerData.totalValue,
        skinCount: winnerData.skinCount,
        img: winnerData.img || "/default-avatar.png",
        color: winnerData.color,
      };

      setWinner(winnerParticipant);
      
    });

    // Listen for spin events to synchronize wheel spin across all clients
    socket.on("spin", (data: SpinEventData) => {
      const { winnerId, startTime, duration } = data;
      console.log(data);
      
      setSpinDuration(duration);
      const delay = startTime - Date.now();

      if (delay < 0) {
        // If the start time is already passed, start immediately
        initiateSpin(winnerId, duration);
      } else {
        // Schedule the spin to start at the specified startTime
        setTimeout(() => {
          initiateSpin(winnerId, duration);
        }, delay);
      }
    });

    // Cleanup the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, [participants]);

  const initiateSpin = (winnerId: WinnerData, duration: number) => {
    const winnerParticipant = participants.find((p) => p.color === winnerId.color);
    if (winnerParticipant) {
      // setWinner(winnerParticipant);
      setShowWinnerAnnouncement(false); // Reset the announcement display
    }
  };

  // Calculate the total value of the jackpot and the total number of skins
  const totalJackpotValue: number = useMemo(() => {
    return participants.reduce((acc, participant) => acc + participant.totalValue, 0);
  }, [participants]);

  const totalSkins: number = useMemo(() => {
    return participants.reduce((acc, participant) => acc + participant.skinCount, 0);
  }, [participants]);

  return (
    <>
      {/* Jackpot Main Heading */}
      <div className="w-full text-center mt-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-green-400">
          Current Jackpot
        </h1>
      </div>

      {/* Always show the wheel */}
      <div className="w-full mt-10 text-center">
        <h2 className="text-sm md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500">
          The Jackpot Wheel
        </h2>

        <div className="w-full relative">
          <div className="flex justify-between items-center z-30 -top-3 px-5 absolute w-full">
            <div className="bg-black rounded-md text-[10px] md:text-xs text-white px-2 py-1 w-40">
              Total pot Value:{" "}
              <span className="text-yellow-300">${totalJackpotValue.toFixed(2)}</span>
            </div>
            <div className="bg-black rounded-md text-[10px] md:text-xs text-white px-2 py-1 w-40">
              Skinscount: <span className="text-yellow-300">{totalSkins}</span>
            </div>
          </div>
          <HorizontalWheel
            participants={participants}
            winner={winner}
            spinDuration={spinDuration}
            onSpinComplete={() => setShowWinnerAnnouncement(true)}
          />
        </div>
      </div>

      {/* Timer Positioned Over the Box */}
      <div className="-mt-10">
        <TimerBox />
      </div>

      {/* Display participants */}
      <div className="w-full">
        <div className="w-[95%] flex flex-wrap justify-center md:justify-start gap-6 mt-7 mx-auto">
          {participants.map((participant) => (
            <ParticipantCard key={participant.id} participant={participant} total={totalJackpotValue}/>
          ))}
        </div>
        <p className="text-gray-300 text-[10px] md:text-sm text-center mt-10">
          Round hash: {roundhash}
        </p>
      </div>

      {/* Winner Announcement */}
      {showWinnerAnnouncement && winner && (
        <div className="flex justify-center">
          <WinnerAnnouncement
            bgColor={winner.color}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="content">🎉 Winner: {winner.username} 🎉</div>
          </WinnerAnnouncement>
        </div>
      )}
    </>
  );
}

// ----------------------
// ParticipantCard Component
// ----------------------

interface ParticipantCardProps {
  participant: Participant;
  total: number
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, total }) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleClose = () => {
    setShowAll(false);
  };

  return (
    <>
      <div
        style={{
          background: `${participant.color}`,
          paddingRight: "15px",
          width: "20%",
        }}
      >
        {participant.items.length > 0 && (
          <div
            className="flex items-center pl-4 col-span-2 p-2 cursor-pointer transition-colors duration-200 hover:!bg-[#3D3A40]"
            onClick={handleShowAll}
            style={{ background: "rgba(72, 64, 68, 0.9)" }}
            title="View all skins"
          >
            <Image
              width={45}
              height={45}
              className="rounded-full border-5"
              src={participant.img}
              alt={participant.username}
            />
            <div className="flex flex-col pl-2">
              <div className="flex ">
                <div className="h-5 px-1 rounded-sm flex items-center justify-center bg-[#FFC839] text-[8px]">
                  {/* You can display additional info here */}
                </div>
                <p className="text-[#9b9ba1] ml-1 text-[12px]">
                  <span className="font-semibold text-white">{participant.username}</span>{" "}
                </p>
              </div>
              <p className="text-[12px] text-white">
                {participant.skinCount} {participant.skinCount === 1 ? "Skin" : "Skins"} | $
                {participant.totalValue.toFixed(2)} | 
                {(participant.totalValue/total  * 100).toFixed(2)} %
              </p>
            </div>
          </div>
        )}
      </div>
      <Modal 
        isOpen={showAll} 
        onClose={handleClose} 
        title={`${participant.username}'s Skins`} 
        borderColor={participant.color} // Adjust borderWidth as needed
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 overflow-y-auto max-h-96">
          {participant.items.map((item) => (
            <ItemBadge key={item.assetId} item={item} />
          ))}
        </div>
      </Modal>

    </>
  );
};

// ----------------------
// ItemBadge Component
// ----------------------

interface ItemBadgeProps {
  item: Item;
}

const ItemBadge: React.FC<ItemBadgeProps> = ({ item }) => {
  return (
    <div
      className="flex items-center bg-gray-600 rounded-md p-1 hover:bg-gray-500 transition-colors duration-200"
      title={`${item.name} - ${item.price}`}
    >
      <Image
        src={item.iconUrl}
        alt={item.name}
        width={32}
        height={32}
        className="rounded-md"
        loading="lazy" // Enable lazy loading for better performance
      />
      <div className="ml-2 flex flex-col">
        <span className="text-xs text-white font-medium truncate w-24">{item.name}</span>
        <span className="text-xs text-gray-300">{item.price}</span>
      </div>
    </div>
  );
};







// // components/JackpotStatus.tsx

// "use client";

// import { useEffect, useState, useMemo } from "react";
// import { io, Socket } from "socket.io-client";
// import axios, { AxiosResponse } from "axios";
// import Image from "next/image";
// import HorizontalWheel from "../wheel/index"; // Ensure correct path
// import TimerBox from "../timer/timer"; // Ensure correct path
// import Modal from "../ModalInventory"; // Import the Modal component
// import img from "@/assets/images/icon.jpg";

// // Define environment variable for Socket.IO server URL
// const SOCKET_SERVER_URL =
//   process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

// // Helper function to extract numeric value from a price string (e.g., "12.34 USD" -> 12.34)
// const extractPrice = (priceString: string): number => {
//   const match = priceString.match(/([\d,.]+)/);
//   if (match) {
//     return parseFloat(match[1].replace(/,/g, ""));
//   }
//   return 0;
// };

// // ----------------------
// // Type Definitions
// // ----------------------

// // Interface for an individual item
// interface Item {
//   _id: string;
//   name: string;
//   iconUrl: string;
//   price: string; // e.g., "12.34 USD"
//   tradable: boolean;
//   owner: string;
//   assetId: string;
//   appId: number;
//   contextId: number;
//   createdAt: string; // ISO date string
//   __v: number;
// }

// interface User {
//   avatar: {
//     small: string;
//     medium?: string;
//     large?: string;
//   };
//   _id: string;
//   steamId: string;
//   username: string;
//   inventory: string[];
//   createdAt: string; // ISO date string
//   __v: number;
// }

// // Interface for participant data received from the server
// interface ParticipantData {
//   user: User;
//   items: Item[];
//   color: string; // Added color property
// }

// // Interface for a participant in the frontend state
// interface Participant {
//   id: string; // Unique identifier (user ID)
//   username: string;
//   items: Item[]; // Array of invested items
//   totalValue: number;
//   skinCount: number;
//   img: string;
//   color: string; // Color assigned by backend
// }

// // Interface for winner data received from the server
// interface WinnerData {
//   id: string;
//   username: string;
//   items: Item[];
//   totalValue: number;
//   skinCount: number;
//   img: string;
//   color: string;
// }

// // Interface for the round result received from the server
// interface RoundResult {
//   winner: WinnerData;
// }

// // Interface for the jackpot status response from the server
// interface JackpotStatusResponse {
//   participants: ParticipantData[];
// }

// // Interface for the spin event received from the server
// interface SpinEventData {
//   winnerId: string;
//   startTime: number; // Unix timestamp in milliseconds
//   duration: number; // Spin duration in milliseconds
// }

// // Utility to map backend data to frontend Participant structure
// const mapParticipants = (participantsData: ParticipantData[]): Participant[] => {
//   return participantsData.map((participant) => {
//     const user = participant.user;
//     const totalValue = participant.items.reduce((acc, item) => {
//       const price = extractPrice(item.price);
//       return acc + price;
//     }, 0);

//     return {
//       id: user._id, // Ensure 'id' is included
//       username: user.username || "Unknown",
//       items: participant.items, // Include items
//       totalValue: totalValue,
//       skinCount: participant.items.length,
//       img: user.avatar.small || "/default-avatar.png",
//       color: participant.color, // Use color from backend
//     };
//   });
// };

// // ----------------------
// // JackpotStatus Component
// // ----------------------

// export default function JackpotStatus() {
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [winner, setWinner] = useState<Participant | null>(null);
//   const [spinDuration, setSpinDuration] = useState<number>(5000); // Default to 5 seconds

//   useEffect(() => {
//     // Initialize Socket.IO client
//     console.log(SOCKET_SERVER_URL);

//     const socket: Socket = io(SOCKET_SERVER_URL);

//     // Fetch initial jackpot data
//     const fetchJackpotData = async () => {
//       try {
//         const response: AxiosResponse<JackpotStatusResponse> = await axios.get(
//           `${SOCKET_SERVER_URL}/jackpotSystem/status`,
//         );
//         const participantsData: ParticipantData[] = response.data.participants;
//         console.log(participantsData);

//         const initialParticipants: Participant[] = mapParticipants(participantsData);

//         setParticipants(initialParticipants);
//       } catch (error: any) {
//         console.error(
//           "Error fetching jackpot data:",
//           error.response ? error.response.data : error.message,
//         );
//       }
//     };

//     fetchJackpotData();

//     // Listen for participants update
//     socket.on("participants", (data: JackpotStatusResponse) => {
//       const updatedParticipants: Participant[] = mapParticipants(data.participants);
//       setParticipants(updatedParticipants);
//     });

//     // Listen for timer updates
//     socket.on("timer", (data: any) => {
//       // Timer updates are handled inside the TimerBox component
//       // You can add any additional logic here if needed
//     });

//     // Listen for round result
//     socket.on("roundResult", (data: RoundResult) => {
//       const winnerData = data.winner;

//       // Directly set the winner since the structure matches Participant
//       const winnerParticipant: Participant = {
//         id: winnerData.id,
//         username: winnerData.username || "Unknown",
//         items: winnerData.items,
//         totalValue: winnerData.totalValue,
//         skinCount: winnerData.skinCount,
//         img: winnerData.img || "/default-avatar.png",
//         color: winnerData.color,
//       };

//       setWinner(winnerParticipant);
//     });

//     // Listen for spin events to synchronize wheel spin across all clients
//     socket.on("spin", (data: SpinEventData) => {
//       const { winnerId, startTime, duration } = data;
//       setSpinDuration(duration);
//       const delay = startTime - Date.now();

//       if (delay < 0) {
//         // If the start time is already passed, start immediately
//         initiateSpin(winnerId, duration);
//       } else {
//         // Schedule the spin to start at the specified startTime
//         setTimeout(() => {
//           initiateSpin(winnerId, duration);
//         }, delay);
//       }
//     });

//     // Cleanup the socket connection when the component is unmounted
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const initiateSpin = (winnerId: string, duration: number) => {
//     const winnerParticipant = participants.find(p => p.id === winnerId);
//     if (winnerParticipant) {
//       setWinner(winnerParticipant);
//       // Optionally, handle any pre-spin UI changes here
//     }
//   };

//   // Calculate the total value of the jackpot and the total number of skins
//   const totalJackpotValue: number = useMemo(() => {
//     return participants.reduce(
//       (acc, participant) => acc + participant.totalValue,
//       0,
//     );
//   }, [participants]);

//   const totalSkins: number = useMemo(() => {
//     return participants.reduce(
//       (acc, participant) => acc + participant.skinCount,
//       0,
//     );
//   }, [participants]);

//   return (
//     <>
//       {/* Jackpot Main Heading */}
//       <div className="w-full text-center mt-10">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-green-400">
//           Current Jackpot
//         </h1>
//       </div>

//       {/* Rectangle Box with Total Jackpot Value and Skins */}
//       {/* <div className="w-full flex justify-center mt-10 mb-11">
//         <div className="relative w-[80%] max-w-[800px]">
//           <div className="absolute inset-0 bg-gray-800 rounded-md shadow-lg"></div>

//           <div className="relative z-10 flex justify-between items-center p-4">
//             <div className="flex items-center">
//               <p className="text-lg md:text-xl font-bold text-white">
//                 Total Jackpot Value:
//               </p>
//               <p className="text-2xl md:text-3xl font-extrabold text-green-400 ml-2">
//                 ${totalJackpotValue.toFixed(2)}
//               </p>
//             </div>
//             <div className="flex items-center">
//               <p className="text-lg md:text-xl font-bold text-white">
//                 Total Skins:
//               </p>
//               <p className="text-2xl md:text-3xl font-extrabold text-yellow-400 ml-2">
//                 {totalSkins}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       {/* Always show the wheel */}
//       <div className="w-full mt-10 text-center">
//         <h2 className="text-sm md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500">
//           The Jackpot Wheel
//         </h2>
        
//         <div className="w-full relative">
//         <div className="flex justify-between items-center z-30 -top-3 px-5 absolute w-full">
//         <div className="bg-black rounded-md text-[10px] md:text-xs text-white px-2 py-1 w-40">
//         Total pot Value:{" "}
//           <span className="text-yellow-300">
//           ${totalJackpotValue.toFixed(2)}
//           </span>
//         </div>
//         <div className="bg-black rounded-md text-[10px] md:text-xs text-white px-2 py-1 w-40">
//           Skinscount:{" "}
//           <span className="text-yellow-300">
//           {totalSkins}
//           </span>
//         </div>
//         </div>
//           <HorizontalWheel participants={participants} winner={winner} spinDuration={spinDuration} />
//         </div>
//       </div>
//       {/* Timer Positioned Over the Box */}
//       <div className="-mt-10">
//         <TimerBox />
//       </div>
//       {/* Display participants */}
//       <div className="w-full">
//         <div className="w-[95%] flex flex-wrap justify-center md:justify-start gap-6 mt-7 mx-auto">
//           {participants.map((participant) => (
//             <ParticipantCard
//               key={participant.id}
//               participant={participant}
//             />
//           ))}
//         </div>
//         <p className="text-gray-300 text-[10px] md:text-sm text-center mt-10">
//           Round hash: (Your round hash here)
//         </p>
//       </div>
//     </>
//   );
// }

// // ----------------------
// // ParticipantCard Component
// // ----------------------

// interface ParticipantCardProps {
//   participant: Participant;
// }

// const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant }) => {
//   const [showAll, setShowAll] = useState<boolean>(false);

//   const handleShowAll = () => {
//     setShowAll(true);
//   };

//   const handleClose = () => {
//     setShowAll(false);
//   };

//   return (
//     <>
//       {/* <div
//         className="w-full max-w-sm bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
//         style={{ border: `2px solid ${participant.color}` }} // Use backend-assigned color
//       > */}
//         {/* <div className="flex items-center p-4">
//           <Image
//             width={60}
//             height={60}
//             className="rounded-full border-2 border-gray-600"
//             src={participant.img}
//             alt={participant.username}
//           />
//           <div className="ml-4">
//             <h3 className="text-xl font-semibold text-white">
//               {participant.username}
//             </h3>
//             <p className="text-sm text-gray-300">
//               {participant.skinCount}{" "}
//               {participant.skinCount === 1 ? "Skin" : "Skins"} | $
//               {participant.totalValue.toFixed(2)}
//             </p>
//           </div>
//         </div> */}

//         <div 
//         style={{ background: `${participant.color}` , paddingRight:'15px' , width:'20%' }}
//         >
//               {participant.items.length > 0 && (
//               <div
//                   className={`flex items-center pl-4 col-span-2 p-2  cursor-pointer transition-colors duration-200 hover:!bg-[#3D3A40] `}
//                   onClick={handleShowAll}
//                   style={{ background: `rgba(72, 64, 68, 0.9)`}}
//                   title="View all skins"
//                 >
//                 <Image
//                 width={45}
//                 height={45}
//                 className="rounded-full border-5"
//                 src={participant.img}
//                 alt={participant.username}
//                 />
//                 <div className="flex flex-col pl-2">
//                   <div className="flex ">
//                     <div className="h-5 px-1 rounded-sm flex items-center justify-center bg-[#FFC839] text-[8px]">
//                       40
//                     </div>
//                     <p className="text-[#9b9ba1] ml-1 text-[12px]">
//                       <span className="font-semibold text-white">
//                       {participant.username}
//                       </span>{" "}
//                     </p>
//                   </div>
//                   <p className="text-[12px] text-white">
//                   {participant.skinCount}{" "}
//                   {participant.skinCount === 1 ? "Skin" : "Skins"} | $
//                   {participant.totalValue.toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//               )}
//           </div>

//         {/* Divider */}
//         {/* <hr className="border-gray-600" /> */}

//         {/* Invested Skins */}
//         {/* <div className="p-4">
//           <p className="text-sm font-medium text-yellow-400 mb-2">
//             Invested Skins:
//           </p>
//           <div className="grid grid-cols-2 gap-2">
//             {participant.items.slice(0, 4).map((item) => (
//               <ItemBadge key={item.assetId} item={item} />
//             ))}
//             {participant.items.length > 4 && (
//               <div
//                 className="flex items-center justify-center col-span-2 p-2 bg-gray-600 rounded-md cursor-pointer hover:bg-gray-500 transition-colors duration-200"
//                 onClick={handleShowAll}
//                 title="View all skins"
//               >
//                 <span className="text-xs text-gray-300">
//                   +{participant.items.length - 4} more
//                 </span>
//               </div>
//             )}
//           </div>
//         </div> */}

//         {/* Modal to show all skins */}
//       {/* </div> */}
//       <Modal
//         isOpen={showAll}
//         onClose={handleClose}
//         title={`${participant.username}'s Skins`}
//       >
//         <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 overflow-y-auto max-h-96">
//           {participant.items.map((item) => (
//             <ItemBadge key={item.assetId} item={item} />
//           ))}
//         </div>
//       </Modal>
//     </>
//   );
// };

// // ----------------------
// // ItemBadge Component
// // ----------------------

// interface ItemBadgeProps {
//   item: Item;
// }

// const ItemBadge: React.FC<ItemBadgeProps> = ({ item }) => {
//   return (
//     <div
//       className="flex items-center bg-gray-600 rounded-md p-1 hover:bg-gray-500 transition-colors duration-200"
//       title={`${item.name} - ${item.price}`}
//     >
//       <Image
//         src={item.iconUrl}
//         alt={item.name}
//         width={32}
//         height={32}
//         className="rounded-md"
//         loading="lazy" // Enable lazy loading for better performance
//       />
//       <div className="ml-2 flex flex-col">
//         <span className="text-xs text-white font-medium truncate w-24">
//           {item.name}
//         </span>
//         <span className="text-xs text-gray-300">{item.price}</span>
//       </div>
//     </div>
//   );
// };
