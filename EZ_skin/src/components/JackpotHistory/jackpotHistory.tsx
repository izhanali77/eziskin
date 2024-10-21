// components/JackpotHistory/jackpotHistory.tsx

"use client";

import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { io, Socket } from "socket.io-client";

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
  iconUrl:string
  // Add other item fields if necessary
}

interface Participant {
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
interface UpdatedJackpot {
  msg: string;
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
      className="mt-10  mb-10 cursor-pointer transition-colors duration-200 rounded-md"
      onClick={() => onClick(jackpot)}
    >
      {/* Jackpot Details */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 relative flex justify-center items-center w-full h-20 mt-7 rounded-md ">
        <div className="flex absolute -top-4 w-full justify-between px-4">
          <div className="bg-black bg-opacity-70 rounded-md text-[10px] md:text-xs text-white px-2 py-1">
            Commission (%):{" "}
            <span className="text-yellow-300">
              {jackpot.commissionPercentage}%
            </span>
          </div>
          <div className="bg-black bg-opacity-70 rounded-md text-[10px] md:text-xs text-white px-2 py-1">
            Status:{" "}
            <span className="text-yellow-300">
              {jackpot.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>
        <div className="bg-gray-900 bg-opacity-80 text-sm md:text-base text-white px-10 py-2 rounded-lg shadow-lg flex">
          <Image
            width={40}
            height={40}
            className="rounded-full mr-4"
            src={jackpot.winner?.avatar?.small || "/default-avatar.png"} // Ensure you have a default avatar image in public directory
            alt={jackpot.winner?.username || "Unknown User"}
          />
          <div className="mt-2">
            {jackpot.winner?.username || "No Winner"}{" "}
            <span className="text-yellow-300">|</span> won the pot valued at{" "}
            <span className="text-yellow-300">
              ${jackpot.totalValue.toFixed(2)}
            </span>
            {/* <span className="text-yellow-300">{jackpot.commissionPercentage}%</span> */}
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="w-full">
        <p className="text-gray-300 text-[10px] md:text-sm text-center">
          Round hash: {jackpot._id}
        </p>
      </div>
    </div>
  );
};

// Main JackpotHistory Component with Modal
const JackpotHistory: React.FC = () => {
  const [jackpots, setJackpots] = useState<Jackpot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJackpot, setSelectedJackpot] = useState<Jackpot | null>(null);
  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  // Fetch completed jackpots from the backend
  useEffect(() => {
    const fetchCompletedJackpots = async () => {
      try {
        const response = await axios.get<Jackpot[]>(
          `${SOCKET_SERVER_URL}/jackpotSystem/history`, {
              withCredentials: true
          }
        ); // Adjust the endpoint if necessary
        console.log(response.data);

        setJackpots(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching completed jackpots:", err);
        setError("Failed to load jackpots.");
        setLoading(false);
      }
    };

    fetchCompletedJackpots();


    const socket: Socket = io(SOCKET_SERVER_URL);
    socket.on('updatedJackPot',(data : UpdatedJackpot)=>{
      console.log(data.msg);
      
      if (data.msg === 'success') {
        fetchCompletedJackpots();
        
      }
    })
  }, []);

  // Handler to open modal with selected jackpot
  const openModal = (jackpot: Jackpot) => {
    setSelectedJackpot(jackpot);
  };

  // Handler to close modal
  const closeModal = () => {
    setSelectedJackpot(null);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading jackpots...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (jackpots.length === 0) {
    return (
      <p className="text-center text-gray-500">No completed jackpots found.</p>
    );
  }
  
  return (
    <div className="w-full px-4 md:px-8 lg:px-16 py-8">
      <div className="border-t-2 border-gray-900 w-full text-center mb-10 ">
        <h1 className="text-4xl mt-8 md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
          Jackpot History
        </h1>
        <h3 className=" font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-600 to-yellow-500">
          (Last 24 hours)
        </h3>
      </div>
      <div className="overflow-auto h-96">
        {jackpots.map((jackpot) => (
          <JackpotCard
            key={jackpot._id}
            jackpot={jackpot}
            onClick={openModal}
          />
        ))}
        {/* {jackpots.map((jackpot) => (
            <JackpotCard key={jackpot._id} jackpot={jackpot} onClick={openModal} />
        ))} */}
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
            <div className="fixed inset-0 bg-gray-700 bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
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
                            {new Date(selectedJackpot.createdAt).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                              second: 'numeric',
                              hour12: true,
                              timeZone: 'UTC' // Force display in UTC
                            })}
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
                          <div className="space-y-4">
                            {selectedJackpot.participants.map(
                              (participant, idx) => (
                                <div
                                  key={idx}
                                  className="flex  gap-4 p-4 border border-gray-600 rounded-lg shadow-sm bg-gray-700"
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
                                      participant.user.username ||
                                      "Unknown User"
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
                                    <ul className="list list-inside mt-2 text-gray-300 grid grid-cols-2 items-center gap-3">
                                      {participant.items.map((item) => (
                                        <li key={item._id} className="flex items-center gap-x-5 p-2 px-5 border border-gray-600 rounded-lg shadow-sm bg-gray-800">
                                          <Image
                                          width={60}
                                          height={60}
                                          className="rounded-full"
                                          src={
                                            item.iconUrl ||
                                            "/default-avatar.png"
                                          }
                                          alt={
                                            item.name ||
                                            "Unknown User"
                                          }
                                        />
                                          {item.name} - ${item.price} 

                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ),
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
