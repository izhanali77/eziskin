// src/context/GameStateContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface GameState {
  status: 'waiting' | 'in_progress' | 'spinning' | 'cooldown';
  spinStartTime: number ;
  spinDuration: number;
  nextRoundStartTime: number ;
  winner: any;
}

interface GameStateContextProps {
  gameState: GameState;
}

export const GameStateContext = createContext<GameStateContextProps>({
  gameState: {
    status: 'waiting',
    spinStartTime: 0,
    spinDuration: 5000,
    nextRoundStartTime: 0,
    winner: null,
  },
});

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    status: 'waiting',
    spinStartTime: 0,
    spinDuration: 5000,
    nextRoundStartTime: 0,
    winner: null,
  });

  const SOCKET_SERVER_URL =
    process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'https://app-1bb60d42-2055-46c8-8af0-2d1a94fdfe9f.cleverapps.io';

  useEffect(() => {
    const socket: Socket = io(SOCKET_SERVER_URL);

    socket.on('gameStateUpdate', (data: GameState) => {
      setGameState(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [SOCKET_SERVER_URL]);

  return (
    <GameStateContext.Provider value={{ gameState }}>
      {children}
    </GameStateContext.Provider>
  );
};
