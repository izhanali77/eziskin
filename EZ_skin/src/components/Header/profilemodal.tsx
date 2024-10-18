"use client";
import { useUserContext } from "@/context/UserContext";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { useEffect, useState } from "react";
import axios from "axios"; // For API requests

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 500,
  height: "auto",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "#2C2C2E",
  boxShadow: 24,
  borderRadius: 4,
};

type ProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

type Stats = {
  deposited: number;
  totalWon: number;
  profit: number;
  recentWinnings: {
    winner: string;
    amount: string;
    chance: string;
    gamemode: string;
    winningTrade: string;
  }[];
};

export default function ProfileModal({
  open,
  onClose,
}: ProfileModalProps) {
  const { username, avatar } = useUserContext();
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchProfileStats = async () => {
    try {
      // const response = await axios.get("/api/profile-stats"); // Replace with your actual API endpoint
      const data = {
        "deposited": 1500.50,
        "totalWon": 3200.75,
        "profit": 1700.25,
        "recentWinnings": [
          {
            "winner": "User123",
            "amount": "$500.00",
            "chance": "25%",
            "gamemode": "Classic",
            "winningTrade": "Trade ID 456"
          },
          {
            "winner": "User456",
            "amount": "$300.00",
            "chance": "15%",
            "gamemode": "Speed",
            "winningTrade": "Trade ID 789"
          },
          {
            "winner": "User789",
            "amount": "$200.00",
            "chance": "10%",
            "gamemode": "Lucky Draw",
            "winningTrade": "Trade ID 123"
          },
          {
            "winner": "User101",
            "amount": "$150.00",
            "chance": "12%",
            "gamemode": "Challenge",
            "winningTrade": "Trade ID 987"
          },
          {
            "winner": "User202",
            "amount": "$100.00",
            "chance": "5%",
            "gamemode": "Event",
            "winningTrade": "Trade ID 654"
          }
        ]
      }
      
      setStats(data);
    } catch (error) {
      console.error("Error fetching profile stats:", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchProfileStats();
    }
  }, [open]);

  const handleBoxClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} onClick={handleBoxClick}>
        <div className="w-full">
          <div
            className="w-full flex flex-col gap-y-2 justify-center items-center h-[30vh] bg-[#3D3A40] grayscale"
            style={{
              backgroundImage:
                'url("https://cdn.vox-cdn.com/thumbor/RqHrFJDREMKw3WrqWdBuFGrg-S4=/726x0:1920x620/1200x675/filters:focal(1223x18:1529x324)/cdn.vox-cdn.com/uploads/chorus_image/image/72723842/counter_strike_2_logo_characters.0.jpg")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img
              src={avatar}
              className="rounded-full w-32 h-32 border border-white p-1"
              alt="steam.userprofileimg"
            />
            <span className="text-xl uppercase text-white font-semibold">
              {username}
            </span>
          </div>
          <div className="p-5">
            <h1 className="text-lg font-bold tracking-tight uppercase text-white px-7">
              Statistics:
            </h1>
            {stats ? (
              <div className="flex justify-center gap-x-10">
                <div className="px-3 py-1 text-center">
                  <div className="text-green-500 group shadow-xl px-5 py-3 rounded-lg transition ease-out hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-green-500 duration-300 cursor-pointer">
                    ${stats.deposited.toFixed(2)}
                  </div>
                  <h4 className="text-base font-medium text-white">Deposited</h4>
                </div>
                <div className="px-3 py-1 text-center">
                  <div className="text-green-500 group shadow-xl px-5 py-3 rounded-lg transition ease-out hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-green-500 duration-300 cursor-pointer">
                    ${stats.totalWon.toFixed(2)}
                  </div>
                  <h4 className="text-base font-medium text-white">Total Won</h4>
                </div>
                <div className="px-3 py-1 text-center">
                  <div className="text-red-500 group shadow-xl px-5 py-3 rounded-lg transition ease-out hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-red-500 duration-300 cursor-pointer">
                    ${stats.profit.toFixed(2)}
                  </div>
                  <h4 className="text-base font-medium text-white">Profit</h4>
                </div>
              </div>
            ) : (
              <div className="text-center text-white">Loading statistics...</div>
            )}
          </div>
          <div className="w-full p-5 overflow-x-auto">
            <table className="table mx-auto mt-10 text-white">
              <thead>
                <tr className="flex gap-x-0 justify-center text-sm">
                  <th className="border border-gray-200 px-3 py-3 flex items-center">
                    Winner
                  </th>
                  <th className="border border-gray-200 px-3 flex items-center">
                    Amount
                  </th>
                  <th className="border border-gray-200 px-3 flex items-center">
                    Chance
                  </th>
                  <th className="border border-gray-200 px-3 flex items-center">
                    Gamemode
                  </th>
                  <th className="border border-gray-200 px-3 flex items-center">
                    Winning Trade
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentWinnings.map((winning, index) => (
                  <tr key={index} className="flex gap-x-0 justify-center text-sm">
                    <td className="border border-gray-200 px-3 flex items-center">
                      {winning.winner}
                    </td>
                    <td className="border border-gray-200 px-3 flex items-center">
                      {winning.amount}
                    </td>
                    <td className="border border-gray-200 px-3 flex items-center">
                      {winning.chance}
                    </td>
                    <td className="border border-gray-200 px-3 flex items-center">
                      {winning.gamemode}
                    </td>
                    <td className="border border-gray-200 px-3 flex items-center">
                      {winning.winningTrade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 p-4 cursor-pointer ease-out hover:scale-y-150 duration-300"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={25}
            height={25}
            viewBox="0 0 50 50"
            fill="white"
            className="hover:fill-red-700"
          >
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
          </svg>
        </div>
      </Box>
    </Modal>
  );
}


// "use client";
// import { useUserContext } from "@/context/UserContext";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import React, { useEffect, useState } from "react";

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "100%",
//   maxWidth: 500,
//   height: "auto",
//   maxHeight: "90vh",
//   overflowY: "auto",
//   bgcolor: "#2C2C2E",
//   boxShadow: 24,
//   borderRadius: 4,
// };

// type ProfileModalProps = {
//   open: boolean;
//   onClose: () => void;
// };

// export default function ProfileModal({
//   open,
//   onClose,
// }: ProfileModalProps) {
//   const { username, avatar } = useUserContext();

//   const handleBoxClick = (event: React.MouseEvent<HTMLDivElement>) => {
//     event.stopPropagation();
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={onClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={style} onClick={handleBoxClick}>
//         <div className="w-full">
//           <div
//             className="w-full flex flex-col gap-y-2 justify-center items-center h-[30vh] bg-[#3D3A40] grayscale"
//             style={{
//               backgroundImage:
//                 'url("https://cdn.vox-cdn.com/thumbor/RqHrFJDREMKw3WrqWdBuFGrg-S4=/726x0:1920x620/1200x675/filters:focal(1223x18:1529x324)/cdn.vox-cdn.com/uploads/chorus_image/image/72723842/counter_strike_2_logo_characters.0.jpg")',
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//             }}
//           >
//             <img
//               src={avatar}
//               className="rounded-full w-32 h-32 border border-white p-1"
//               alt="steam.userprofileimg"
//             />
//             <span className="text-xl uppercase text-white font-semibold">
//               {username}
//             </span>
//           </div>
//           <div className="p-5">
//             <h1 className="text-lg font-bold tracking-tight uppercase text-white px-7">
//               Statistics:
//             </h1>
//             <div className="flex justify-center gap-x-10">
//               <div className="px-3 py-1 text-center">
//                 <div className="text-green-500 group shadow-xl px-5 py-3 rounded-lg transition ease-out hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-green-500 duration-300 cursor-pointer">
//                   $32.00
//                 </div>
//                 <h4 className="text-base font-medium text-white">Deposited</h4>
//               </div>
//               <div className="px-3 py-1 text-center">
//                 <div className="text-green-500 group shadow-xl px-5 py-3 rounded-lg transition ease-out hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-green-500 duration-300 cursor-pointer">
//                   $9.00
//                 </div>
//                 <h4 className="text-base font-medium text-white">Total Won</h4>
//               </div>
//               <div className="px-3 py-1 text-center">
//                 <div className="text-red-500 group shadow-xl px-5 py-3 rounded-lg transition ease-out hover:-translate-y-1 hover:scale-110 hover:text-white hover:bg-red-500 duration-300 cursor-pointer">
//                   $-23.00
//                 </div>
//                 <h4 className="text-base font-medium text-white">Profit</h4>
//               </div>
//             </div>
//           </div>
//           <div className="w-full p-5 overflow-x-auto">
//             <table className="table mx-auto mt-10 text-white">
//               <thead>
//                 <tr className="flex gap-x-0 justify-center text-sm">
//                   <th className="border border-gray-200 px-3 py-3 flex items-center">
//                     Winner
//                   </th>
//                   <th className="border border-gray-200 px-3 flex items-center">
//                     Amount
//                   </th>
//                   <th className="border border-gray-200 px-3 flex items-center">
//                     Chance
//                   </th>
//                   <th className="border border-gray-200 px-3 flex items-center">
//                     Gamemode
//                   </th>
//                   <th className="border border-gray-200 px-3 flex items-center">
//                     Winning Trade
//                   </th>
//                 </tr>
//               </thead>
//               <tbody></tbody>
//             </table>
//           </div>
//         </div>
//         <div
//           className="absolute top-0 right-0 p-4 cursor-pointer ease-out hover:scale-y-150 duration-300"
//           onClick={onClose}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width={25}
//             height={25}
//             viewBox="0 0 50 50"
//             fill="white"
//             className="hover:fill-red-700"
//           >
//             <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z" />
//           </svg>
//         </div>
//       </Box>
//     </Modal>
//   );
// }
