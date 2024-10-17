// ----------------------
// ItemBadge Component
// ----------------------
import Image from "next/image";

interface ItemBadgeProps {
  item: Item;
}

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

export default ItemBadge;




