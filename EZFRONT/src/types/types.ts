// types/types.ts

// Interface for an individual item
export interface Item {
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
  
  // Interface for a user
  export interface User {
    username?: string;
    avatar: {
      small: string;
      medium?: string;
      large?: string;
    };
    // Add other user fields if necessary
  }
  
  // Interface for participant data received from the server
  export interface ParticipantData {
    user: User;
    items: Item[];
  }
  
  // Interface for a participant in the frontend state
  export interface Participant {
    username: string;
    items: Item[]; // Array of invested items
    totalValue: number;
    skinCount: number;
    img: string;
    color: string; // Added color property
  }
  
  // Interface for the round result received from the server
  export interface RoundResult {
    winnerIndex: number;
    winnerParticipant: Participant;
  }
  
  // Interface for the jackpot status response from the server
  export interface JackpotStatusResponse {
    participants: ParticipantData[];
  }
  