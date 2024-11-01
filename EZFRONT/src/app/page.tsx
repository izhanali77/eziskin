// "use client";
// import back from "@/assets/images/home.jpg";
// import Chat from "@/components/chat";
// import JackpotStatus from "@/components/jacpotStatusapifetch/page";
// import Image from "next/image";
// import SdCardSharpIcon from '@mui/icons-material/SdCardSharp';
// import QuizSharpIcon from '@mui/icons-material/QuizSharp';
// import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
// import { useEffect, useState, useMemo } from "react";
// import { io, Socket } from "socket.io-client";
// import axios, { AxiosResponse } from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import HistoryContent from "@/components/historyContent";
// import MenuBarSvg from "@/assets/svg/menuBARS";
// import MobileChat from "@/components/mobileChatModel";

// const SOCKET_SERVER_URL =
//   process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "https://app-1bb60d42-2055-46c8-8af0-2d1a94fdfe9f.cleverapps.io";

// const extractPrice = (priceString: string): number => {
//   console.log("hello", priceString, typeof (priceString));

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

// // Interface for the jackpot status response from the server
// interface JackpotStatusResponse {
//   _id: string;
//   participants: ParticipantData[];
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

// export default function HomePage() {
//   const [selectedTab, setSelectedTab] = useState('Home');
//   const [participants, setParticipants] = useState<Participant[]>([]);
//   const [roundHash, setRoundHash] = useState<string>("");
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const handleOpen = () => setIsOpen(true);
//   const handleClose = () => setIsOpen(false);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };

//     handleResize(); // Check on mount
//     window.addEventListener('resize', handleResize); // Check on resize

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleToggleChat = () => {
//     if (!isMobile) { // Disable toggling on mobile screens
//       setIsChatOpen(prev => !prev);
//     }
//   };

//   // const handleToggleChat = () => {
//   //   setIsChatOpen(prev => !prev);
//   // };

//   useEffect(() => {
//     // Initialize Socket.IO client
//     console.log(SOCKET_SERVER_URL);

//     const socket: Socket = io(SOCKET_SERVER_URL);

//     // Fetch initial jackpot data
//     const fetchJackpotData = async () => {
//       try {
//         const response: AxiosResponse<JackpotStatusResponse> = await axios.get(
//           `${SOCKET_SERVER_URL}/jackpotSystem/status`
//         );
//         const participantsData: ParticipantData[] = response.data.participants;
//         const roundHash = response.data._id
//         console.log(participantsData);

//         const initialParticipants: Participant[] = mapParticipants(participantsData);

//         setParticipants(initialParticipants);
//         setRoundHash(response.data._id);
//       } catch (error: any) {
//         console.error(
//           "Error fetching jackpot data:",
//           error.response ? error.response.data : error.message
//         );
//       }
//     };

//     fetchJackpotData();

//     // Listen for participants update
//     socket.on("participants", (data: JackpotStatusResponse) => {
//       fetchJackpotData();
//     });

//     // Cleanup the socket connection when the component is unmounted
//     return () => {
//       socket.disconnect();
//     };
//   }, []);
//   const handleOnSpinComplete = ()=>{
//     setParticipants([])
//   }
//   // Calculate all skins from participants
//   const allSkins = useMemo(() => {
//     return participants.flatMap((participant) =>
//       participant.items.map((item) => ({
//         ...item,
//         participantColor: participant.color,
//         participantImg: participant.img,
//         participantUsername: participant.username,
//       }))
//     );
//   }, [participants]);

//   return (
//     <>
//       <div
//         className="w-full h-[calc(100vh-72px)] overflow-y-hidden flex bg-[#404040] "
//       >
//         <div className="h-full flex border-r-[1px] border-black  pt-2 items-center flex-col bg-[#2C2C2E] w-14">
//           <button onClick={handleToggleChat}>
//             <MenuBarSvg />
//           </button>
//           <div className="h-full w-full flex flex-col gap-y-6 py-14 items-center">
//             <button
//               // onClick={handleOpen}
//               className="text-sm flex flex-col items-center font-semibold leading-6"
//             >
//               <SdCardSharpIcon htmlColor="#5B595C" />
//               <span className="text-xs text-[#5B595C]">ToS</span>
//             </button>
//             <a
//               href="/FAQ"
//               className="text-sm flex flex-col items-center font-semibold leading-6"
//             >
//               <QuizSharpIcon htmlColor="#5B595C" />
//               <span className="text-xs text-[#5B595C]">FAQ's</span>
//             </a>
//             <div className="text-sm lg:hidden flex flex-col items-center font-semibold leading-6" onClick={handleOpen}>
//             <ChatOutlinedIcon htmlColor="#5B595C" />
//             <span className="text-xs text-[#5B595C]">Chat</span>
//             </div>
//             <MobileChat isOpen={isOpen} handleClose={handleClose} />
//           </div>
//         </div>

//         <Chat isOpen={isChatOpen} />
//         <div
//         className={`w-full ${isChatOpen ? 'lg:w-[80%]' : 'lg:w-full'} overflow-y-auto h-auto blur-background`}
//           style={{
//             backgroundImage: `url(${back.src})`,
//             backgroundRepeat: "no-repeat",
//             backgroundSize: "cover",

//           }}
//         >

//           <div className="w-full mx-auto relative z-10">
//             <div className="flex items-center justify-start gap-5 py-3 bg-[#2C2C2E] w-full sticky top-0 z-50 px-4">
//               <motion.button
//                 className={`tabbutton w-32 flex justify-center py-2 text-center transition-all duration-300 ease-in-out ${selectedTab === 'Home' ? 'bg-white text-black' : 'bg-headerBackground text-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
//                 onClick={() => setSelectedTab('Home')}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: 'spring', stiffness: 300 }}
//               >
//                 Home
//               </motion.button>
//               <motion.button
//                 className={`tabbutton w-32 flex justify-center py-2 text-center transition-all duration-300 ease-in-out ${selectedTab === 'History' ? 'bg-white text-black' : 'bg-headerBackground text-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
//                 onClick={() => setSelectedTab('History')}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: 'spring', stiffness: 300 }}
//               >
//                 History
//               </motion.button>
//             </div>

//             <div className="w-full">
//               {selectedTab === 'Home' ? (
//                 <div>
//                   <div className="mx-auto flex justify-start gap-1 overflow-x-scroll my-5 w-[90%] h-36 scrollbar-hidden">
//                     <AnimatePresence initial={false}>
//                       {allSkins.map((skin) => (
//                         <motion.div
//                           key={skin._id}
//                           initial={{ opacity: 0, x: 50 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           exit={{ opacity: 0, x: -50 }}
//                           transition={{ duration: 0.5 }}
//                           className="relative flex flex-shrink-0 items-center justify-center w-48 h-28 border-[#2C2C2E] border-t-4 border-l-0 border-r-0 border-b-4 border-[1px] bg-gradient-to-r from-[#404040] to-[#636363]"
//                           style={{ borderBottomColor: skin.participantColor }}
//                         >
//                           <Image
//                             alt="User Avatar"
//                             src={skin.participantImg}
//                             width={25}
//                             height={25}
//                             className="rounded-full absolute right-1 top-1"
//                           />
//                           <div className="flex items-center justify-start gap-0">
//                             <div className="text-[#EEC475] text-[11px] absolute left-0 top-0 bg-[#2C2C2E] w-12 h-6 flex justify-center items-center">
//                               ${extractPrice(skin.price).toFixed(2)}
//                             </div>
//                             <div className="inclined-div h-6 w-4 absolute left-12 top-0 rotate bg-[#2C2C2E]"></div>
//                           </div>
//                           <img
//                             src={skin.iconUrl}
//                             alt={skin.name}
//                             width={62}
//                             height={62}
//                           />
//                           <p className="text-white text-[10px] absolute bottom-0 text-left w-full px-1">
//                             {skin.name}
//                           </p>
//                         </motion.div>
//                       ))}
//                     </AnimatePresence>
//                   </div>

//                   <JackpotStatus participants={participants} roundhash={roundHash} onSpinCompleteInventryReload={() => handleOnSpinComplete()}/>
//                 </div>
//               ) : (
//                 <HistoryContent />
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// HomePage.tsx

"use client";
import back from "@/assets/images/home.jpg";
import Chat from "@/components/chat";
import JackpotStatus from "@/components/jacpotStatusapifetch/page";
import Image from "next/image";
import SdCardSharpIcon from "@mui/icons-material/SdCardSharp";
import QuizSharpIcon from "@mui/icons-material/QuizSharp";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { useEffect, useState, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import HistoryContent from "@/components/historyContent";
import MenuBarSvg from "@/assets/svg/menuBARS";
import MobileChat from "@/components/mobileChatModel";

// Import useQuery and useQueryClient from React Query
import { useQuery, useQueryClient } from "@tanstack/react-query";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "https://app-1bb60d42-2055-46c8-8af0-2d1a94fdfe9f.cleverapps.io";

// Utility function to extract price
const extractPrice = (priceString: string): number => {
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
const mapParticipants = (
  participantsData: ParticipantData[],
): Participant[] => {
  return participantsData.map((participant) => {
    const user = participant.user;
    const totalValue = participant.items.reduce((acc, item) => {
      const price = extractPrice(item.price);
      return acc + price;
    }, 0);

    return {
      id: user._id,
      username: user.username || "Unknown",
      items: participant.items,
      totalValue: totalValue,
      skinCount: participant.items.length,
      img: user.avatar.small || "/default-avatar.png",
      color: participant.color,
    };
  });
};

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState("Home");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleChat = () => {
    if (!isMobile) {
      setIsChatOpen((prev) => !prev);
    }
  };

  // Fetch function for React Query
  const fetchJackpotData = async (): Promise<JackpotStatusResponse> => {
    const response = await axios.get(
      `${SOCKET_SERVER_URL}/jackpotSystem/status`,
    );
    return response.data;
  };

  // Use useQuery to fetch data with the new object syntax
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["jackpotData"],
    queryFn: fetchJackpotData,
  });

  // Handle Socket.IO updates
  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL);

    // Listen for participants update and refetch data
    socket.on("participants", () => {
      refetch();
    });

    // Cleanup the socket connection when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  // Process participants data
  const participants = data ? mapParticipants(data.participants) : [];
  const roundHash = data ? data._id : "";

  const handleOnSpinComplete = () => {
    queryClient.invalidateQueries({ queryKey: ["jackpotData"] });
  };

  // Calculate all skins from participants
  const allSkins = useMemo(() => {
    return participants.flatMap((participant) =>
      participant.items.map((item) => ({
        ...item,
        participantColor: participant.color,
        participantImg: participant.img,
        participantUsername: participant.username,
      })),
    );
  }, [participants]);

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#404040]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#404040]">
        <div className="text-red-500">
          Error: {error instanceof Error ? error.message : "An error occurred"}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-[calc(100vh-72px)] overflow-y-hidden flex bg-[#404040] ">
        <div className="h-full flex border-r-[1px] border-black  pt-2 items-center flex-col bg-[#2C2C2E] w-14">
          <button onClick={handleToggleChat}>
            <MenuBarSvg />
          </button>
          <div className="h-full w-full flex flex-col gap-y-6 py-14 items-center">
            <button className="text-sm flex flex-col items-center font-semibold leading-6">
              <SdCardSharpIcon htmlColor="#5B595C" />
              <span className="text-xs text-[#5B595C]">ToS</span>
            </button>
            <a
              href="/FAQ"
              className="text-sm flex flex-col items-center font-semibold leading-6"
            >
              <QuizSharpIcon htmlColor="#5B595C" />
              <span className="text-xs text-[#5B595C]">FAQ's</span>
            </a>
            <div
              className="text-sm lg:hidden flex flex-col items-center font-semibold leading-6"
              onClick={handleOpen}
            >
              <ChatOutlinedIcon htmlColor="#5B595C" />
              <span className="text-xs text-[#5B595C]">Chat</span>
            </div>
            <MobileChat isOpen={isOpen} handleClose={handleClose} />
          </div>
        </div>

        <Chat isOpen={isChatOpen} />

        <div
          className={`w-full ${
            isChatOpen ? "lg:w-[80%]" : "lg:w-full"
          } overflow-y-auto h-auto blur-background`}
          style={{
            backgroundImage: `url(${back.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="w-full mx-auto relative z-10">
            <div className="flex items-center justify-start gap-5 py-3 bg-[#2C2C2E] w-full sticky top-0 z-50 px-4">
              <motion.button
                className={`tabbutton w-32 flex justify-center py-2 text-center transition-all duration-300 ease-in-out ${
                  selectedTab === "Home"
                    ? "bg-white text-black"
                    : "bg-headerBackground text-gray-300 hover:bg-gray-300 hover:text-gray-800"
                }`}
                onClick={() => setSelectedTab("Home")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Home
              </motion.button>
              <motion.button
                className={`tabbutton w-32 flex justify-center py-2 text-center transition-all duration-300 ease-in-out ${
                  selectedTab === "History"
                    ? "bg-white text-black"
                    : "bg-headerBackground text-gray-300 hover:bg-gray-300 hover:text-gray-800"
                }`}
                onClick={() => setSelectedTab("History")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                History
              </motion.button>
            </div>

            <div className="w-full">
              {selectedTab === "Home" ? (
                <div>
                  <div className="mx-auto flex justify-start gap-1 overflow-x-scroll my-5 w-[90%] h-36 scrollbar-hidden">
                    <AnimatePresence initial={false}>
                      {allSkins.map((skin) => (
                        <motion.div
                          key={skin._id}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5 }}
                          className="relative flex flex-shrink-0 items-center justify-center w-48 h-28 border-[#2C2C2E] border-t-4 border-l-0 border-r-0 border-b-4 border-[1px] bg-gradient-to-r from-[#404040] to-[#636363]"
                          style={{ borderBottomColor: skin.participantColor }}
                        >
                          <Image
                            alt="User Avatar"
                            src={skin.participantImg}
                            width={25}
                            height={25}
                            className="rounded-full absolute right-1 top-1"
                          />
                          <div className="flex items-center justify-start gap-0">
                            <div className="text-[#EEC475] text-[11px] absolute left-0 top-0 bg-[#2C2C2E] w-12 h-6 flex justify-center items-center">
                              ${extractPrice(skin.price).toFixed(2)}
                            </div>
                            <div className="inclined-div h-6 w-4 absolute left-12 top-0 rotate bg-[#2C2C2E]"></div>
                          </div>
                          <img
                            src={skin.iconUrl}
                            alt={skin.name}
                            width={62}
                            height={62}
                          />
                          <p className="text-white text-[10px] absolute bottom-0 text-left w-full px-1">
                            {skin.name}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <JackpotStatus
                    participants={participants}
                    roundhash={roundHash}
                    onSpinCompleteInventryReload={handleOnSpinComplete}
                  />
                </div>
              ) : (
                <HistoryContent />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
