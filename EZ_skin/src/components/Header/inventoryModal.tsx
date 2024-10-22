// // InventoryModal.tsx
// import * as React from "react";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import Button from "@mui/material/Button";
// import Image from "next/image";
// import HistoryIMG from "@/assets/images/history.png";
// import MoneyImg from "@/assets/images/money-bag.png";
// import InventoryPage from "@/pages/inventory";
// import axios from "axios";
// import TradeURLModalComponent from "./tradeUrlModal"; // Import the reusable component

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "#3D3A40",
//   boxShadow: 24,
//   pt: 2,
//   px: 4,
//   pb: 3,
// };

// interface InventoryItem {
//   iconUrl: string;
//   name: string;
//   price: string;
//   owner: string;
//   _id: string;
// }

// export default function InventoryModal() {
//   const [open, setOpen] = React.useState(false);
//   const [tradeModalOpen, setTradeModalOpen] = React.useState(false);
//   const [selectedItems, setSelectedItems] = React.useState<InventoryItem[]>([]);
//   const [tradeOfferUrl, setTradeOfferUrl] = React.useState<string | null>(null);
//   const [tradeUrlModalOpen, setTradeUrlModalOpen] = React.useState(false); // New state variable

//   const SOCKET_SERVER_URL =
//     process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

//   const handleOpen = (event: React.MouseEvent) => {
//     event.stopPropagation(); // Prevent event propagation
//     setOpen(true);
//   };

//   const handleClose = (event: React.MouseEvent) => {
//     event.stopPropagation(); // Prevent event propagation
//     setSelectedItems([]); // Clear the selected items
//     setOpen(false);
//   };

//   const handleModalContentClick = (event: React.MouseEvent) => {
//     event.stopPropagation();
//   };

//   const handleItemSelection = (item: InventoryItem) => {
//     if (selectedItems.length < 20) {
//       setSelectedItems((prevItems) => [...prevItems, item]);
//     }
//   };

//   const handleJackpotDeposit = async () => {
//     try {
//       const transformedItems = selectedItems.map((item) => item._id);
//       const userId = selectedItems[0].owner;
//       const response = await axios.post(
//         `${SOCKET_SERVER_URL}/jackpotSystem/join`,
//         {
//           itemIds: transformedItems,
//           userId: userId,
//         }
//       );

//       if (response.data.tradeOfferUrl) {
//         setTradeOfferUrl(response.data.tradeOfferUrl);
//         setTradeModalOpen(true);
//       } else if (response.data.tradeUrl === false) {
//         // Open the Trade URL Modal if the user does not have a trade URL
//         setTradeUrlModalOpen(true);
//       }
//     } catch (error: any) {
//       console.error(
//         "Jackpot Deposit Error:",
//         error.response ? error.response.data : error.message
//       );
//     }
//   };

//   const handleTradeModalClose = () => {
//     setTradeModalOpen(false);
//     setTradeOfferUrl(null); // Clear the trade offer URL after closing the modal
//   };

//   const handleTradeUrlModalClose = (event: React.MouseEvent) => {
//     event.stopPropagation();
//     setTradeUrlModalOpen(false);
//   };

//   return (
//     <div>
//       <Button onClick={handleOpen}>
//         <div className="flex items-center gap-x-2 font-normal text-white font-[Poppins] tracking-tight text-base bg-green-600 p-2 rounded-md hover:-translate-y-1 transition">
//           <Image src={MoneyImg} alt="" className="w-7 h-7" />
//           Deposit
//         </div>
//       </Button>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="parent-modal-title"
//         aria-describedby="parent-modal-description"
//       >
//         <Box
//           sx={{
//             ...style,
//             height: "90%",
//             width: "90%",
//             borderRadius: 4,
//             position: "relative", // Make sure the close button is positioned relative to the Box
//           }}
//           onClick={handleModalContentClick}
//         >
//           <Button
//             onClick={handleClose}
//             sx={{
//               position: "absolute",
//               top: 8,
//               right: 8,
//               color: "white",
//               fontSize: "1.5rem",
//               minWidth: "unset",
//               padding: "0",
//               "&:hover": {
//                 backgroundColor: "transparent",
//               },
//             }}
//           >
//             &times;
//           </Button>
//           <div className="h-full w-full flex mx-auto">
//             <div className="w-full grid grid-cols-4 items-center gap-x-5">
//               <div className="col-span-1 h-[80%] border border-white rounded-md">
//                 <div className="h-10 bg-white rounded-t-md text-center flex justify-center items-center">
//                   Rewards
//                 </div>
//                 <div className="h-[90%] flex flex-col justify-between items-center">
//                   <div className="flex flex-col gap-y-3 text-center text-white py-2">
//                     <h1 className="text-xl font-semibold my-2">
//                       Available Grub Bucks $0.00
//                     </h1>
//                     <p className="text-lg font-normal">Selected $0.00</p>
//                   </div>
//                   <div className="mt-3 overflow-y-auto w-full p-3">
//                     <ul className="max-h-[270px] overflow-y-auto">
//                       {selectedItems.map((item, index) => (
//                         <li
//                           key={item._id}
//                           className="flex items-center gap-x-2"
//                         >
//                           <span className="text-green-1000 mr-1 ml-2">
//                             {index + 1}.
//                           </span>
//                           <img
//                             src={item.iconUrl}
//                             alt={item.name}
//                             className="w-10 h-10"
//                           />
//                           <span className="text-white">{item.name}</span>
//                           <span className="text-green-700">{item.price}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="flex flex-col gap-y-1">
//                     <button
//                       className="w-96 h-10 flex justify-center items-center bg-white rounded-md font-medium"
//                       onClick={handleJackpotDeposit}
//                     >
//                       Jackpot Deposit
//                     </button>
//                     <button className="w-96 h-10 flex justify-center items-center bg-white rounded-md font-medium">
//                       Create Coinflip
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-span-3 h-[80%] border border-white rounded-md">
//                 <div className="h-10 bg-white rounded-t-md text-center flex justify-center items-center">
//                   Shop
//                 </div>
//                 <div className="mt-3 h-10 text-center flex justify-center items-center gap-x-2">
//                   <Image
//                     src={HistoryIMG}
//                     alt="History Png"
//                     className="w-6 h-6"
//                   />
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width={25}
//                     height={25}
//                     viewBox="0 0 50 50"
//                     fill="white"
//                   >
//                     <path d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z" />
//                   </svg>
//                   <input
//                     type="search"
//                     className="w-[70%] p-2 focus:border focus:border-blue-500 focus:outline-none bg-[#3D3A40] text-white"
//                     placeholder="Search Inventory"
//                   />
//                 </div>
//                 <InventoryPage
//                   onSelectItem={handleItemSelection}
//                   rewardLimitReached={selectedItems.length >= 20}
//                 />
//               </div>
//             </div>
//           </div>
//         </Box>
//       </Modal>

//       {/* Trade Offer Modal */}
//       <Modal
//         open={tradeModalOpen}
//         onClose={handleTradeModalClose}
//         aria-labelledby="trade-modal-title"
//         aria-describedby="trade-modal-description"
//       >
//         <Box
//           sx={{
//             ...style,
//             width: "auto",
//             padding: "20px",
//             textAlign: "center",
//             borderRadius: "8px",
//             bgcolor: "#333",
//             color: "#fff",
//           }}
//         >
//           <h2 id="trade-modal-title">Trade Offer</h2>
//           {tradeOfferUrl && (
//             <div>
//               <p id="trade-modal-description">
//                 Your trade offer has been sent. Please{" "}
//                 <a
//                   href={tradeOfferUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-400 underline"
//                 >
//                   click here
//                 </a>{" "}
//                 to accept the offer.
//               </p>
//             </div>
//           )}
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleTradeModalClose}
//           >
//             Close
//           </Button>
//         </Box>
//       </Modal>

//       {/* Trade URL Modal */}
//       <TradeURLModalComponent
//         open={tradeUrlModalOpen}
//         onClose={handleTradeUrlModalClose}
//       />
//     </div>
//   );
// }

import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Image from "next/image";
import HistoryIMG from "@/assets/images/history.png";
import AK47Img from "@/assets/images/icons8-rust-48.png";
import InventoryPage from "@/pages/inventory";
import axios from "axios";
import TradeURLModalComponent from "./tradeUrlModal"; // Import the reusable component
import { useUserContext } from "@/context/UserContext";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#3D3A40",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

interface InventoryItem {
  iconUrl: string;
  name: string;
  price: string;
  owner: string;
  _id: string;
}

export default function InventoryModal() {
  const [open, setOpen] = React.useState(false);
  const [tradeModalOpen, setTradeModalOpen] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<InventoryItem[]>([]);
  const [totalPrice, setTotalPrice] = React.useState<number>(0);
  const [tradeOfferUrl, setTradeOfferUrl] = React.useState<string | null>(null);
  const [tradeUrlModalOpen, setTradeUrlModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState<string>(""); // Search query state
  const { username } = useUserContext();

  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  const handleOpen = (event: React.MouseEvent) => {
    event.stopPropagation();
    setOpen(true);
  };

  const handleClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setTotalPrice(0)
    setSelectedItems([]);
    setOpen(false);
  };

  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleItemSelection = (item: InventoryItem[]) => {
      setSelectedItems(item);
  };

  const handlePrice = (totalPrice: number) => {
    setTotalPrice(totalPrice);
  };

  const handleJackpotDeposit = async () => {
    try {
      const transformedItems = selectedItems.map((item) => item._id);
      const userId = selectedItems[0].owner;
      const token =localStorage.getItem('jwtToken')
      const response = await axios.post(
        `${SOCKET_SERVER_URL}/jackpotSystem/join`,
        {
          itemIds: transformedItems,
          userId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the retrieved token here
          }
        }
      );

      if (response.data.tradeOfferUrl) {
        setTradeOfferUrl(response.data.tradeOfferUrl);
        setTradeModalOpen(true);
      } else if (response.data.tradeUrl === false) {
        setTradeUrlModalOpen(true);
      }
    } catch (error: any) {
      console.error(
        "Jackpot Deposit Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleTradeModalClose = () => {
    setTradeModalOpen(false);
    setTradeOfferUrl(null);
  };

  const handleTradeUrlModalClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setTradeUrlModalOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpen}>
        <div className="flex items-center gap-x-3 font-medium text-white tracking-wide text-lg bg-green-700 px-4 py-3 rounded-lg hover:bg-green-900 hover:shadow-lg transition-transform duration-200 transform hover:-translate-y-1">
          <Image src={AK47Img} alt="AK-47 Icon" className="w-7 h-7" />
          <span>Deposit</span>
        </div>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            ...style,
            height: "90%",
            width: "50%",
            borderRadius: 4,
            position: "relative",
          }}
          onClick={handleModalContentClick}
        >
          <div className="flex">
            <div className="h-10 rounded-t-mdjustify-center text-white font-light">
              Deposited Items ~  
            </div>
            <div className="h-10 rounded-t-mdjustify-center text-green-600 ml-1">
              {selectedItems.length}/20
            </div>
          </div>
          <div className="relative flex-grow -mt-4 mb-4">
            <div className="h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-md shadow-lg"></div>
            <div className="absolute inset-0 h-1 bg-gray-500 transform translate-y-1 rounded-md shadow-md"></div>
          </div>
          <div className="h-full w-full flex mx-auto">
            <div className="w-full items-center gap-x-5">
              <div className="col-span-3 h-[90%] border border-white rounded-md">
                <div className="h-10 bg-white rounded-t-md text-center flex justify-center items-center">
                  {username} Inventory
                </div>
                <InventoryPage
                  onSelectItem={handleItemSelection}
                  onTotalPrice={handlePrice}
                  searchQuery={searchQuery} // Passing the search query to InventoryPage
                />
              </div>

              <div className="flex justify-between items-center mt-3 px-4">
              <div className="flex items-center gap-x-3 bg-[#3D3A40] p-2 rounded-lg w-3/4">
                  <Image
                    src={HistoryIMG}
                    alt="History Icon"
                    className="w-6 h-6"
                  />
                  <div className="relative w-full">
                    <input
                      type="search"
                      className="w-full p-2 pl-10 bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg transition duration-300 ease-in-out border border-transparent border-gray-500 "
                      placeholder="Search Inventory"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 4a6 6 0 100 12 6 6 0 000-12zm4 4h6m-6 0l-1-1m1 1l1 1"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  className="ml-4 w-1/4 h-10 bg-green-700 text-white text-lg rounded-lg hover:bg-green-900 transition duration-200 transform hover:scale-105 flex justify-center items-center"
                  onClick={handleJackpotDeposit}
                >
                  Deposit $ {totalPrice.toFixed(2)}
                </button>
                <button
                  className="ml-4 w-1/6 h-10 bg-slate-700 text-white text-lg rounded-lg hover:bg-slate-900 transition duration-200 transform hover:scale-105 flex justify-center items-center"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Trade Offer Modal */}
      <Modal
        open={tradeModalOpen}
        onClose={handleTradeModalClose}
        aria-labelledby="trade-modal-title"
        aria-describedby="trade-modal-description"
      >
        <Box
          sx={{
            ...style,
            width: "auto",
            padding: "20px",
            textAlign: "center",
            borderRadius: "8px",
            bgcolor: "#333",
            color: "#fff",
          }}
        >
          <h2 id="trade-modal-title">Trade Offer</h2>
          {tradeOfferUrl && (
            <div>
              <p id="trade-modal-description">Trade Offer URL:</p>
              <a
                href={tradeOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {tradeOfferUrl}
              </a>
            </div>
          )}
          <Button onClick={handleTradeModalClose} color="primary">
            Close
          </Button>
        </Box>
      </Modal>

      {/* Trade URL Modal */}
      <TradeURLModalComponent
        open={tradeUrlModalOpen}
        onClose={handleTradeUrlModalClose}
      />
    </div>
  );
}
