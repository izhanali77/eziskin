"use client";

import React, { useState, Fragment, ReactNode } from "react";
import axios from "axios";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// Import useQuery from React Query
import { useQuery } from "@tanstack/react-query";

// Type Definitions

interface User {
  _id: string;
  username: string;
  avatar: { small: string; medium: string; large: string };
  // Add other user fields if necessary
}

interface Item {
  _id: string;
  name: string; // Added 'name' for display purposes
  price: number;
  iconUrl: string;
  // Add other item fields if necessary
}

interface Participant {
  color: ReactNode;
  user: User;
  items: Item[];
}

interface Jackpot {
  _id: string;
  participants: Participant[];
  totalValue: number;
  winner?: User;
  commissionPercentage: number;
  status: "waiting" | "in_progress" | "completed";
  countdown: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  roundHash: string;
}

// Helper Function to Determine Border Color Based on Participant's Total Value
const getBorderColor = (totalValue: number): string => {
  if (totalValue > 100) return "#F15C49"; // Red for high value
  if (totalValue > 50) return "#29A2D3"; // Blue for medium value
  return "#F3BA2A"; // Yellow for low value
};

// JackpotCard Component
const JackpotCard: React.FC<{
  jackpot: Jackpot;
  onClick: (jackpot: Jackpot) => void;
}> = ({ jackpot, onClick }) => {
  return (
    <div
      className="cursor-pointer transition-colors duration-200 rounded-md overflow-visible w-full"
      onClick={() => onClick(jackpot)}
    >
      {/* Jackpot Details */}
      <div className="perspective-1000">
        <div className="custom-container h-40 w-full md:h-44 md:w-80 md:lg:h-60 lg:w-[350px] bg-[#2C2C2E] mt-7 overflow-visible relative transform-style [preserve-3d] transition-transform duration-300 hover:rotate-y-180">
          {/* Front Side */}
          <div className="front-face absolute inset-0 flex justify-center items-center shadow-inner ">
            <span className="flex flex-col justify-center items-center space-y-3">
              <Image
                width={50}
                height={50}
                className="rounded-full"
                src={jackpot.winner?.avatar?.small || "/default-avatar.png"}
                alt={jackpot.winner?.username || "Unknown User"}
              />
              <span className="text-base font-bold text-white">
                {jackpot.winner?.username || ""}
              </span>
            </span>
          </div>

          {/* Back Side */}
          <div className="back-face absolute inset-0 flex flex-col justify-center items-center text-white backface-hidden">
            <div className="flex flex-col justify-center items-center text-white relative h-full w-full">
              <div className="flex justify-center items-center">
                <div className="text-sm md:text-base text-white px-10 py-2 rounded-lg flex flex-col items-center">
                  <Image
                    width={40}
                    height={40}
                    className="rounded-full mr-4"
                    src={jackpot.winner?.avatar?.small || "/default-avatar.png"}
                    alt={jackpot.winner?.username || "Unknown User"}
                  />
                  <div className="mt-2">
                    {jackpot.winner?.username || "No Winner"}{" "}
                    <span className="text-yellow-300">|</span> won the pot valued at{" "}
                    <span className="text-yellow-300">
                      ${jackpot.totalValue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex absolute top-24 left-52 w-full justify-between px-4 rotate-45">
                <div className="bg-black bg-opacity-70 rounded-md text-[10px] md:text-xs text-white px-2 py-1">
                  Status:{" "}
                  <span className="text-yellow-300">
                    {jackpot.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full py-2">
              <p className="text-gray-300 text-[5px] md:text-xs text-center">
                Round hash: {jackpot._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main JackpotHistory Component without Socket.IO
const JackpotHistory: React.FC = () => {
  const [selectedJackpot, setSelectedJackpot] = useState<Jackpot | null>(null);
  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  // Fetch function for React Query
  const fetchCompletedJackpots = async (): Promise<Jackpot[]> => {
    const response = await axios.get<Jackpot[]>(
      `${SOCKET_SERVER_URL}/jackpotSystem/history`
    );
    return response.data;
  };

  // Use useQuery to fetch jackpots
  const {
    data: jackpots,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["completedJackpots"],
    queryFn: fetchCompletedJackpots,
  });

  // Handler to open modal with selected jackpot
  const openModal = (jackpot: Jackpot) => {
    setSelectedJackpot(jackpot);
  };

  // Handler to close modal
  const closeModal = () => {
    setSelectedJackpot(null);
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading jackpots...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        {error instanceof Error ? error.message : "Failed to load jackpots."}
      </p>
    );
  }

  if (!jackpots || jackpots.length === 0) {
    return (
      <p className="text-center text-gray-500">No completed jackpots found.</p>
    );
  }

  return (
    <div className="h-full p-8 relative space-y-10">
      <div className="my-4 absolute top-0">
        <h1 className="text-4xl  md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
          Jackpot History
        </h1>
      </div>
      <div className="h-full full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-5">
        {jackpots.map((jackpot) => (
          <JackpotCard key={jackpot._id} jackpot={jackpot} onClick={openModal} />
        ))}
      </div>
      {/* Modal for Jackpot Details */}
      <Transition appear show={selectedJackpot !== null} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* Updated Overlay */}
            <div className="fixed inset-0 bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 lg:p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* Updated Dialog Panel */}
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden bg-headerBackground p-2 lg:p-6 text-left align-middle shadow-xl transition-all">
                  {/* Close Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-gray-300 hover:text-gray-100 focus:outline-none"
                      onClick={closeModal}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  {selectedJackpot && (
                    <div>
                      {/* Dialog Title */}
                      <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-100 mb-4"
                      >
                        Jackpot Details
                      </Dialog.Title>
                      {/* Jackpot Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-gray-300">
                            <strong>Status:</strong>{" "}
                            {selectedJackpot.status
                              .replace("_", " ")
                              .toUpperCase()}
                          </p>
                          <p className="text-gray-300">
                            <strong>Total Value:</strong> $
                            {selectedJackpot.totalValue.toFixed(2)}
                          </p>
                          <p className="text-gray-300">
                            <strong>Winner:</strong>{" "}
                            {selectedJackpot.winner?.username || "No Winner"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-300">
                            <strong>Round Hash:</strong> {selectedJackpot._id}
                          </p>
                          <p className="text-gray-300">
                            <strong>Created At:</strong>{" "}
                            {new Date(selectedJackpot.createdAt).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                                hour12: true,
                                timeZone: "UTC", // Force display in UTC
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      {/* Participants Section */}
                      <div>
                        <h4 className="text-xl font-semibold text-gray-200 mb-2">
                          Participants
                        </h4>
                        {selectedJackpot.participants.length === 0 ? (
                          <p className="text-gray-400">No participants.</p>
                        ) : (
                          <div className="space-y-4 max-h-96 h-full overflow-y-auto">
                            {selectedJackpot.participants.map(
                              (participant, idx) => (
                                <div
                                  key={idx}
                                  className={`flex gap-4 p-4 shadow-xl border border-r-0 border-t-0 border-b-0`}
                                  style={{
                                    borderLeft: `2px solid ${participant.color}`,
                                    borderTop: "none",
                                    borderBottom: "none",
                                    borderRight: "none",
                                  }}
                                >
                                  <Image
                                    width={60}
                                    height={60}
                                    className="rounded-full size-10"
                                    src={
                                      participant.user.avatar.small ||
                                      "/default-avatar.png"
                                    }
                                    alt={
                                      participant.user.username || "Unknown User"
                                    }
                                  />
                                  <div>
                                    <p className="font-semibold text-lg text-gray-100">
                                      {participant.user.username ||
                                        "Unknown User"}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      Items Contributed:{" "}
                                      {participant.items.length}
                                    </p>
                                    <ul className="list list-inside mt-2 text-gray-300 grid grid-cols-1 lg:grid-cols-3 items-center gap-3">
                                      {participant.items.map((item) => (
                                        <li
                                          key={item._id}
                                          className={`flex items-center gap-x-5 p-2 px-5 bg-headerBackground hover:bg-gray-900 transition delay-75 cursor-pointer hover:-translate-y-1`}
                                        >
                                          <Image
                                            width={60}
                                            height={60}
                                            className="rounded-full"
                                            src={
                                              item.iconUrl ||
                                              "/default-avatar.png"
                                            }
                                            alt={item.name || "Unknown Item"}
                                          />
                                          {item.name} - ${item.price}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default JackpotHistory;













// // components/JackpotHistory/jackpotHistory.tsx

// "use client";

// import React, { useEffect, useState, Fragment, ReactNode } from "react";
// import axios from "axios";
// import Image from "next/image";
// import { Dialog, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
// import { io, Socket } from "socket.io-client";

// // Type Definitions

// interface User {
//   _id: string;
//   username: string;
//   avatar: { small: string; medium: string; large: string };
//   // Add other user fields if necessary
// }

// interface Item {
//   _id: string;
//   name: string; // Added 'name' for display purposes
//   price: number;
//   iconUrl: string
//   // Add other item fields if necessary
// }

// interface Participant {
//   color: ReactNode;
//   user: User;
//   items: Item[];
// }

// interface Jackpot {
//   _id: string;
//   participants: Participant[];
//   totalValue: number;
//   winner?: User;
//   commissionPercentage: number;
//   status: "waiting" | "in_progress" | "completed";
//   countdown: number;
//   createdAt: string; // ISO Date string
//   updatedAt: string; // ISO Date string
//   roundHash: string;
// }
// interface UpdatedJackpot {
//   msg: string;
// }
// // Helper Function to Determine Border Color Based on Participant's Total Value
// const getBorderColor = (totalValue: number): string => {
//   if (totalValue > 100) return "#F15C49"; // Red for high value
//   if (totalValue > 50) return "#29A2D3"; // Blue for medium value
//   return "#F3BA2A"; // Yellow for low value
// };

// // JackpotCard Component
// const JackpotCard: React.FC<{
//   jackpot: Jackpot;
//   onClick: (jackpot: Jackpot) => void;
// }> = ({ jackpot, onClick }) => {
//   return (
//     <div
//       className="cursor-pointer transition-colors duration-200 rounded-md overflow-visible w-full"
//       onClick={() => onClick(jackpot)}
//     >
//       {/* Jackpot Details */}
//       <div className="perspective-1000">
//         <div className="custom-container h-40 w-full md:h-44 md:w-80 md:lg:h-60 lg:w-[350px] bg-[#2C2C2E] mt-7 overflow-visible relative transform-style [preserve-3d] transition-transform duration-300 hover:rotate-y-180">

//           {/* Front Side */}
//           <div className="front-face absolute inset-0 flex justify-center items-center shadow-inner ">
//             <span className="flex flex-col justify-center items-center space-y-3">
//               <Image
//                 width={50}
//                 height={50}
//                 className="rounded-full"
//                 src={jackpot.winner?.avatar?.small || "/default-avatar.png"}
//                 alt={jackpot.winner?.username || "Unknown User"}
//               />
//               <span className="text-base font-bold text-white">{jackpot.winner?.username || ""}</span>
//             </span>
//           </div>

//           {/* Back Side */}
//           <div className="back-face absolute inset-0 flex flex-col justify-center items-center text-white backface-hidden">
//             <div className="flex flex-col justify-center items-center text-white relative h-full w-full">
//               <div className="flex justify-center items-center">
//                 <div className="text-sm md:text-base text-white px-10 py-2 rounded-lg flex flex-col items-center">
//                   <Image
//                     width={40}
//                     height={40}
//                     className="rounded-full mr-4"
//                     src={jackpot.winner?.avatar?.small || "/default-avatar.png"}
//                     alt={jackpot.winner?.username || "Unknown User"}
//                   />
//                   <div className="mt-2">
//                     {jackpot.winner?.username || "No Winner"}{" "}
//                     <span className="text-yellow-300">|</span> won the pot valued at{" "}
//                     <span className="text-yellow-300">
//                       ${jackpot.totalValue.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex absolute top-24 left-52 w-full justify-between px-4 rotate-45">
//                 <div className="bg-black bg-opacity-70 rounded-md text-[10px] md:text-xs text-white px-2 py-1">
//                   Status:{" "}
//                   <span className="text-yellow-300">
//                     {jackpot.status.replace("_", " ").toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="w-full py-2">
//               <p className="text-gray-300 text-[5px] md:text-xs text-center">
//                 Round hash: {jackpot._id}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main JackpotHistory Component with Modal
// const JackpotHistory: React.FC = () => {
//   const [jackpots, setJackpots] = useState<Jackpot[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedJackpot, setSelectedJackpot] = useState<Jackpot | null>(null);
//   const SOCKET_SERVER_URL =
//     process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";
//     const token = localStorage.getItem('jwt')
//   // Fetch completed jackpots from the backend
//   useEffect(() => {
//     const fetchCompletedJackpots = async () => {
//       try {
//         const response = await axios.get<Jackpot[]>(
//           `${SOCKET_SERVER_URL}/jackpotSystem/history`
//         ); // Adjust the endpoint if necessary
//         console.log(response.data);

//         setJackpots(response.data);
//         setLoading(false);
//       } catch (err: any) {
//         console.error("Error fetching completed jackpots:", err);
//         setError("Failed to load jackpots.");
//         setLoading(false);
//       }
//     };

//     fetchCompletedJackpots();


//     // const socket: Socket = io(SOCKET_SERVER_URL);
//     // socket.on('updatedJackPot', (data: UpdatedJackpot) => {
//     //   console.log(data.msg);

//     //   if (data.msg === 'success') {
//     //     fetchCompletedJackpots();

//     //   }
//     // })
//   }, []);

//   // Handler to open modal with selected jackpot
//   const openModal = (jackpot: Jackpot) => {
//     setSelectedJackpot(jackpot);
//   };

//   // Handler to close modal
//   const closeModal = () => {
//     setSelectedJackpot(null);
//   };

//   if (loading) {
//     return <p className="text-center text-gray-500">Loading jackpots...</p>;
//   }

//   if (error) {
//     return <p className="text-center text-red-500">{error}</p>;
//   }

//   if (jackpots.length === 0) {
//     return (
//       <p className="text-center text-gray-500">No completed jackpots found.</p>
//     );
//   }

//   return (
//     <div className="h-full p-8 relative space-y-10">
//       <div className="my-4 absolute top-0">
//         <h1 className="text-4xl  md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
//           Jackpot History
//         </h1>
//       </div>
//       <div className="h-full full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-x-5">
//         {jackpots.map((jackpot) => (
//           <JackpotCard
//             key={jackpot._id}
//             jackpot={jackpot}
//             onClick={openModal}
//           />
//         ))}
//       </div>
//       {/* Modal for Jackpot Details */}
//       <Transition appear show={selectedJackpot !== null} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={closeModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             {/* Updated Overlay */}
//             <div className="fixed inset-0 bg-opacity-50" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-2 lg:p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 {/* Updated Dialog Panel */}
//                 <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden bg-headerBackground p-2 lg:p-6 text-left align-middle shadow-xl transition-all">
//                   {/* Close Button */}
//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       className="text-gray-300 hover:text-gray-100 focus:outline-none"
//                       onClick={closeModal}
//                     >
//                       <XMarkIcon className="h-6 w-6" aria-hidden="true" />
//                     </button>
//                   </div>
//                   {selectedJackpot && (
//                     <div>
//                       {/* Dialog Title */}
//                       <Dialog.Title
//                         as="h3"
//                         className="text-2xl font-bold leading-6 text-gray-100 mb-4"
//                       >
//                         Jackpot Details
//                       </Dialog.Title>
//                       {/* Jackpot Information */}
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                         <div>
//                           <p className="text-gray-300">
//                             <strong>Status:</strong>{" "}
//                             {selectedJackpot.status
//                               .replace("_", " ")
//                               .toUpperCase()}
//                           </p>
//                           <p className="text-gray-300">
//                             <strong>Total Value:</strong> $
//                             {selectedJackpot.totalValue.toFixed(2)}
//                           </p>
//                           <p className="text-gray-300">
//                             <strong>Winner:</strong>{" "}
//                             {selectedJackpot.winner?.username || "No Winner"}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-300">
//                             <strong>Round Hash:</strong> {selectedJackpot._id}
//                           </p>
//                           <p className="text-gray-300">
//                             <strong>Created At:</strong>{" "}
//                             {new Date(selectedJackpot.createdAt).toLocaleString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric',
//                               hour: 'numeric',
//                               minute: 'numeric',
//                               second: 'numeric',
//                               hour12: true,
//                               timeZone: 'UTC' // Force display in UTC
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                       {/* Participants Section */}
//                       <div>
//                         <h4 className="text-xl font-semibold text-gray-200 mb-2">
//                           Participants
//                         </h4>
//                         {selectedJackpot.participants.length === 0 ? (
//                           <p className="text-gray-400">No participants.</p>
//                         ) : (
//                           <div className="space-y-4 max-h-96 h-full overflow-y-auto">
//                             {selectedJackpot.participants.map(
//                               (participant, idx) => (
//                                 <>
//                                   <div
//                                     key={idx}
//                                     className={`flex gap-4 p-4 shadow-xl border border-r-0 border-t-0 border-b-0`}
//                                     style={{
//                                       borderLeft: `2px solid ${participant.color}`,
//                                       borderTop: 'none',
//                                       borderBottom: 'none',
//                                       borderRight: 'none',
//                                     }}
//                                   >
//                                     <Image
//                                       width={60}
//                                       height={60}
//                                       className="rounded-full size-10"
//                                       src={
//                                         participant.user.avatar.small ||
//                                         "/default-avatar.png"
//                                       }
//                                       alt={
//                                         participant.user.username ||
//                                         "Unknown User"
//                                       }
//                                     />
//                                     <div>
//                                       <p className="font-semibold text-lg text-gray-100">
//                                         {participant.user.username ||
//                                           "Unknown User"}
//                                       </p>
//                                       <p className="text-sm text-gray-400">
//                                         Items Contributed:{" "}
//                                         {participant.items.length}
//                                       </p>
//                                       <ul className="list list-inside mt-2 text-gray-300 grid grid-cols-1 lg:grid-cols-3 items-center gap-3">
//                                         {participant.items.map((item) => (
//                                           <li key={item._id} className={`flex items-center gap-x-5 p-2 px-5 bg-headerBackground hover:bg-gray-900 transition delay-75 cursor-pointer hover:-translate-y-1`}>
//                                             <Image
//                                               width={60}
//                                               height={60}
//                                               className="rounded-full"
//                                               src={
//                                                 item.iconUrl ||
//                                                 "/default-avatar.png"
//                                               }
//                                               alt={
//                                                 item.name ||
//                                                 "Unknown User"
//                                               }
//                                             />
//                                             {item.name} - ${item.price}

//                                           </li>
//                                         ))}
//                                       </ul>
//                                     </div>
//                                   </div>
//                                 </>
//                               ),
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//     </div>
//   );
// };

// export default JackpotHistory;






// components/JackpotHistory/jackpotHistory.tsx

