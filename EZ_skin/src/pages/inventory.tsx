import React, { useEffect, useState } from "react";

// Define the types
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
  onSelectItem: (item: InventoryItem) => void;
  rewardLimitReached: boolean;
}> = ({ onSelectItem, rewardLimitReached }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [selectionEnabled, setSelectionEnabled] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const steamID64 = params.get("steamID64");
    const appId = params.get("appId") || "252490"; // Default appId if not provided
    const contextId = params.get("contextId") || "2"; // Default contextId if not provided
    const SOCKET_SERVER_URL =
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:5000";

    if (steamID64) {
      const fetchInventory = async () => {
        try {
          const response = await fetch(
            `${SOCKET_SERVER_URL}/api/inventory?steamID64=${steamID64}&appId=${appId}&contextId=${contextId}`,
          );
          if (!response.ok) {
            throw new Error("Failed to fetch inventory");
          }
          const data: InventoryResponse = await response.json();
          setInventory(data.items);
          // console.log(data.inv);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
          // Enable selection after 5 seconds
          setTimeout(() => setSelectionEnabled(true), 2000);
        }
      };

      fetchInventory();
    } else {
      setError("Missing parameters.");
      setLoading(false);
    }
  }, []);

  const handleItemClick = (item: InventoryItem) => {
    if (!rewardLimitReached && selectionEnabled) {
      setInventory((prevInventory) =>
        prevInventory.filter((i) => i._id !== item._id),
      ); // Remove from inventory
      onSelectItem(item); // Send to rewards
      setShowMessage(false); // Hide message when item is successfully moved
    } else if (!selectionEnabled) {
      setShowMessage(true); // Show message if selection is not yet enabled
    } else {
      setShowMessage(true); // Show message if limit is reached
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="overflow-y-auto h-[500px]">
      <h1 className="text-center font-bold text-2xl text-white">Inventory</h1>
      {showMessage && (
        <div className="bg-red-700 text-white p-2 rounded-md text-center mb-4">
          {rewardLimitReached
            ? "You cannot move more than 20 items to the rewards section."
            : "Selection is currently disabled. Please wait."}
        </div>
      )}
      <ul className="grid grid-cols-5 gap-4 p-10">
        {inventory.map((item) => (
          <li key={item._id} onClick={() => handleItemClick(item)}>
            <div
              className={`bg-[#2C2C2E] p-2 rounded-md cursor-pointer ${!selectionEnabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <img src={item.iconUrl} alt={item.name} className="" />
              <div className="w-full flex justify-between items-center p-2 text-xs">
                <p className="font-medium text-white">{item.name}</p>
                <p className="font-medium text-green-700">{item.price}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryPage;
