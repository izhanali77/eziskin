import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface InventoryItem {
  iconUrl: string;
  name: string;
  price: string;
  owner: string;
  _id: string;
}

interface InventoryResponse {
  items: InventoryItem[];
}

const InventoryPage: React.FC<{
  onSelectItem: (items: InventoryItem[]) => void;
  onTotalPrice: (totalPrice: number) => void;
  searchQuery: string; // Added searchQuery prop
}> = ({ onTotalPrice, onSelectItem, searchQuery }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]);
  const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

  // Maximum number of items that can be selected
  const MAX_SELECTED_ITEMS = 20;

  // Fetch inventory and handle loading state
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(
          `${SOCKET_SERVER_URL}/api/inventory`,{
            method: 'GET',
            credentials: 'include' // This ensures the cookie is sent with the request
          } 
        );
        if (!response.ok) {
          throw new Error("Failed to fetch inventory");
        }
        const data: InventoryResponse = await response.json();
        setInventory(data.items);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
        setTimeout(() => setSelectionEnabled(true), 2000);
      }
    };
    fetchInventory();
    if (inventory.length <= 0) {
      setError("No Items in Inventory");
      setLoading(false);
    }
  }, []);

  const handleItemClick = (item: InventoryItem) => {
    const alreadySelected = selectedItems.some(
      (selectedItem) => selectedItem._id === item._id
    );

    if (alreadySelected || (selectedItems.length < MAX_SELECTED_ITEMS && selectionEnabled)) {
      setSelectedItems((prevSelectedItems) => {
        console.log("hello",selectedItems.length);
        
        let newSelectedItems;
        if (alreadySelected) {
          // Unselect the item
          newSelectedItems = prevSelectedItems.filter(
            (selectedItem) => selectedItem._id !== item._id
          );
        } else {
          // Select the item
          newSelectedItems = [...prevSelectedItems, item];
        }

        // Update total price and notify parent of selected items
        updateTotalPrice(newSelectedItems);
        onSelectItem(newSelectedItems);
        return newSelectedItems;
      });
      setShowMessage(null); // Hide any error message when selection is valid
    } else if (!selectionEnabled) {
      setShowMessage("Selection is currently disabled. Please wait.");
    } else if (selectedItems.length >= MAX_SELECTED_ITEMS) {      
      setShowMessage(`You cannot select more than ${MAX_SELECTED_ITEMS} items.`);
    }
  };

  // Function to calculate and send the total price of selected items
  const updateTotalPrice = (selectedItems: InventoryItem[]) => {
    const totalPrice = selectedItems.reduce(
      (total, item) => total + parseFloat(item.price),
      0
    );
    onTotalPrice(totalPrice); // Send the total price to parent
  };

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-y-auto h-[750px]">
      {showMessage && (
        <div className="bg-red-700 text-white p-2 rounded-md text-center mb-4">
          {showMessage}
        </div>
      )}
      <ul className="grid grid-cols-5 gap-4 p-10">
        {filteredInventory.map((item) => {
          const isSelected = selectedItems.some(
            (selectedItem) => selectedItem._id === item._id
          );

          return (
            <li key={item._id} onClick={() => handleItemClick(item)}>
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className={`relative flex items-center justify-center cursor-pointer min-w-[150px] w-[150px] border-b-4 border-[1px] border-[#bbb9b9] h-[150px] ${
                  isSelected ? "bg-green-900" : "bg-[#2C2C2E]"
                }`}
              >
                <div className="text-[#EEC475] text-[11px] absolute left-1 top-1">
                  {item.price}
                </div>
                <img
                  src={item.iconUrl}
                  alt={item.name}
                  width={62}
                  height={62}
                />
                <p className="text-white text-[10px] absolute bottom-0 text-center">
                  {item.name}
                </p>
                {isSelected && (
                  <div className="absolute top-1 right-1 text-green-500">
                    ✔
                  </div> // Tick mark when selected
                )}
              </motion.div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default InventoryPage;








// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// // Define the types
// interface InventoryItem {
//   iconUrl: string;
//   name: string;
//   price: string;
//   owner: string;
//   _id: string;
// }

// interface InventoryResponse {
//   items: InventoryItem[];
// }

// const InventoryPage: React.FC<{
//   onSelectItem: (item: InventoryItem) => void;
//   rewardLimitReached: boolean;
// }> = ({ onSelectItem, rewardLimitReached }) => {
//   const [inventory, setInventory] = useState<InventoryItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showMessage, setShowMessage] = useState<boolean>(false);
//   const [selectionEnabled, setSelectionEnabled] = useState<boolean>(false);
//   const [bgColor, setBgColor] = useState("#2C2C2E"); // Default color

//   // Function to generate random hex color
//   const getRandomColor = () => {
//     const letters = "0123456789ABCDEF";
//     let color = "#";
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   };

//     // Set random background color on component mount
//   useEffect(() => {
//     setBgColor(getRandomColor());
//   }, []);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const steamID64 = params.get("steamID64");
//     const appId = params.get("appId") || "252490"; // Default appId if not provided
//     const contextId = params.get("contextId") || "2"; // Default contextId if not provided
//     const SOCKET_SERVER_URL =
//       process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

//     if (steamID64) {
//       const fetchInventory = async () => {
//         try {
//           const response = await fetch(
//             `${SOCKET_SERVER_URL}/api/inventory?steamID64=${steamID64}&appId=${appId}&contextId=${contextId}`,
//           );
//           if (!response.ok) {
//             throw new Error("Failed to fetch inventory");
//           }
//           const data: InventoryResponse = await response.json();
//           setInventory(data.items);
//           // console.log(data.inv);
//         } catch (err: any) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//           // Enable selection after 5 seconds
//           setTimeout(() => setSelectionEnabled(true), 2000);
//         }
//       };

//       fetchInventory();
//     } else {
//       setError("Missing parameters.");
//       setLoading(false);
//     }
//   }, []);

  // const handleItemClick = (item: InventoryItem) => {
  //   if (!rewardLimitReached && selectionEnabled) {
  //     setInventory((prevInventory) =>
  //       prevInventory.filter((i) => i._id !== item._id),
  //     ); // Remove from inventory
  //     onSelectItem(item); // Send to rewards
  //     setShowMessage(false); // Hide message when item is successfully moved
  //   } else if (!selectionEnabled) {
  //     setShowMessage(true); // Show message if selection is not yet enabled
  //   } else {
  //     setShowMessage(true); // Show message if limit is reached
  //   }
  // };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   return (
//     <div className="overflow-y-auto h-[750px]">
//       {/* <h1 className="text-center font-bold text-2xl text-white">Inventory</h1> */}
      // {showMessage && (
      //   <div className="bg-red-700 text-white p-2 rounded-md text-center mb-4">
      //     {rewardLimitReached
      //       ? "You cannot move more than 20 items to the rewards section."
      //       : "Selection is currently disabled. Please wait."}
      //   </div>
      // )}
//       <ul className="grid grid-cols-5 gap-4 p-10">
//         {inventory.map((item) => (
//           <li key={item._id} onClick={() => handleItemClick(item)}>
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, x: 50 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -50 }}
//                 transition={{ duration: 0.5 }}
//                 className={`relative flex items-center justify-center cursor-pointer min-w-[150px] w-[150px] border-b-4 border-[1px] border-[#bbb9b9] h-[150px] bg-[#2C2C2E] ${!selectionEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
//                 // style={{ borderBottomColor:bgColor }}
//               >
//                 <div className="text-[#EEC475] text-[11px] absolute left-1 top-1">
//                   {item.price}
//                 </div>
//                 <img
//                   src={item.iconUrl}
//                   alt={item.name}
//                   width={62}
//                   height={62}
//                 />
//                 <p className="text-white text-[10px] absolute bottom-0 text-center">
//                   {item.name}
//                 </p>
//               </motion.div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default InventoryPage;

