// Chat.tsx

import { useEffect, useState, useRef, FormEvent } from "react";
import { io, Socket } from "socket.io-client";
import Image from "next/image";
import img from "@/assets/images/icon.jpg"; // Update the path if necessary
import { useUserContext } from "@/context/UserContext";

// Define the structure of a chat message
interface Message {
  username: string;
  text: string;
  avatar: string;
  timestamp: string; // ISO string for consistency
}

// Define the structure of the avatar object
interface Avatar {
  small: string;
  // Add other fields if necessary
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socket = useRef<Socket | null>(null);
  const { username, avatar } = useUserContext()

  // Initialize Socket.IO client
  useEffect(() => {
    if (socket.current) return; // Prevent multiple connections

    // Replace with your actual Socket.IO server URL or use environment variables
    const socketURL =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000/chat";
    socket.current = io(socketURL);

    // Listen for initial messages
    socket.current.on("initialMessages", (msgs: Message[]) => {
      setMessages(msgs);
    });

    // Listen for incoming chat messages
    socket.current.on("chatMessage", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up on component unmount
    return () => {
      socket.current?.disconnect();
      socket.current = null;
    };
  }, []);

  // Scroll to the latest message when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending messages
  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    if (!username || !avatar) {
      alert("Please log in to send messages.");
      return;
    }

    const message: Message = {
      username: username,
      text: inputMessage,
      avatar: avatar,
      timestamp: new Date().toISOString(),
    };

    // Emit the message to the server
    socket.current?.emit("chatMessage", message);

    // Remove the optimistic update
    // setMessages((prevMessages) => [...prevMessages, message]);

    // Clear the input field
    setInputMessage("");
  };

  return (
    <div className="h-[95vh] w-[17%] hidden md:flex flex-col bg-[#2C2C2E]">
      <p className="text-[#9b9ba1] text-center mt-3">Chat</p>
      <div className="mt-3 h-[80vh] overflow-y-auto flex flex-col gap-[1px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="flex rounded-lg gap-2 bg-[#3D3A40] mx-2 px-2 py-1 items-center"
          >
            <Image
              alt={msg.username}
              width={30}
              height={30}
              className="rounded-full"
              src={msg.avatar || img.src}
            />
            <div className="flex flex-col">
              <p className="text-[#9b9ba1] text-[12px]">
                <span className="font-semibold text-white">
                  {msg.username}:
                </span>{" "}
                {msg.text}
              </p>
              {/* Optional: Display timestamp */}
              {/* <p className="text-[#6b6b6b] text-[10px]">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p> */}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full flex justify-center mt-2">
        <form onSubmit={sendMessage} className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Chat Here"
            className="w-[90%] pl-3 text-sm text-white bg-[#3D3A40] h-8"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;

// // Chat.js

// import { useEffect, useState, useRef } from 'react';
// import io from 'socket.io-client';
// import Image from 'next/image';
// import img from '@/assets/images/icon.jpg'; // Update the path if necessary

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const messagesEndRef = useRef(null);
//   const urlParams = new URLSearchParams(window.location.search);
//   const usernameFromURL = urlParams.get("username");
//   const avatarString : any  = urlParams.get("avatar");
//   const avatar = JSON.parse(avatarString);

//   // console.log(avatar.small);

//   // Initialize Socket.IO client
//   const socket = useRef();

//   useEffect(() => {
//     // Connect to the chat namespace
//     socket.current = io('http://localhost:5000/chat'); // Note the '/chat' namespace

//     // Listen for initial messages
//     socket.current.on('initialMessages', (msgs) => {
//       setMessages(msgs);
//     });

//     // Listen for incoming chat messages
//     socket.current.on('chatMessage', (msg) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     // Clean up on component unmount
//     return () => {
//       socket.current.disconnect();
//     };
//   }, []);

//   // Scroll to the latest message when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const sendMessage = (e) => {
//     e.preventDefault();

//     if (inputMessage.trim() === '') return;

//     // Create a message object
//     if (!usernameFromURL && !avatar) {
//       alert('login please')
//       return;
//     }
//     const message = {
//       username: usernameFromURL, // Replace with actual username
//       text: inputMessage,
//       avatar: avatar.small, // Replace with actual avatar path if available
//       timestamp: new Date(),
//     };

//     // Emit the message to the server
//     socket.current.emit('chatMessage', message);

//     // Clear the input field
//     setInputMessage('');
//   };

//   return (
//     <div className="h-[95vh] w-[17%] hidden md:flex flex-col bg-[#2C2C2E]">
//       <p className="text-[#9b9ba1] text-center mt-3">Chat</p>
//       <div className="mt-3 h-[80vh] overflow-y-auto flex flex-col gap-[1px]">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className="flex rounded-lg gap-2 bg-[#3D3A40] mx-2 px-2 py-1 items-center"
//           >
//             <Image
//               alt={msg.username}
//               width={30}
//               className="rounded-full"
//               height={30}
//               src={msg.avatar || img}
//             />
//             <div className="flex flex-col">
//               <p className="text-[#9b9ba1] text-[12px]">
//                 <span className="font-semibold text-white">{msg.username}:</span>{' '}
//                 {msg.text}
//               </p>
//               {/* Optional: Display timestamp */}
//               {/* <p className="text-[#6b6b6b] text-[10px]">
//                 {new Date(msg.timestamp).toLocaleTimeString()}
//               </p> */}
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>
//       <div className="w-full flex justify-center mt-2">
//         <form onSubmit={sendMessage} className="w-full flex justify-center">
//           <input
//             type="text"
//             placeholder="Chat Here"
//             className="w-[90%] pl-3 text-sm text-white bg-[#3D3A40] h-8"
//             value={inputMessage}
//             onChange={(e) => setInputMessage(e.target.value)}
//           />
//         </form>
//       </div>
//     </div>
//   );
// }
