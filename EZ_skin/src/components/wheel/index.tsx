// components/wheel/index.tsx

import audiom from "@/assets/audio/dice.mp3";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import styled from "styled-components";

// Styled-components for the wheel container
const WheelContainer = styled.div`
  width: 100%;
  overflow: hidden;
  border: 5px solid #2e3746;
  position: relative;
  height: 120px; /* Adjust height as needed */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  border-radius: 10px; /* Optional: Rounded corners */
`;

// Wheel styled with Framer Motion
const Wheel = styled(motion.div)<{ totalValue: number }>`
  display: flex;
  flex-direction: row;
  width: 500%; /* Duplicate wheel items for seamless looping */
  height: 100%;
`;

// WheelItem Styled Component with Diagonal Stripe Background
const WheelItem = styled.div<{ bgColor: string; value: number; totalValue: number }>`
  width: ${({ value, totalValue }) => (value / totalValue) * 100}%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ bgColor }) => bgColor || "#fff"};
  position: relative; /* For positioning pseudo-element */
  overflow: hidden;
  transition: background-color 0.3s;

  /* Diagonal Stripe Pattern */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 200%; /* Ensure the stripes cover the full width */
    height: 200%; /* Ensure the stripes cover the full height */
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 75%,
      transparent 75%,
      transparent
    );
    background-size: 20px 20px; /* Adjust the size of the diagonal stripes */
    pointer-events: none; /* Allows clicks to pass through to underlying elements */
  }

  /* Optional: Add a slight border between segments */
  &:not(:last-child) {
    border-right: 2px solid #2e3746;
  }
`;

interface Item {
  _id: string;
  name: string;
  iconUrl: string;
  price: string;
  tradable: boolean;
  owner: string;
  assetId: string;
  appId: number;
  contextId: number;
  createdAt: string;
  __v: number;
}

interface Participant {
  id: string; // Unique identifier (user ID)
  username: string;
  items: Item[];
  totalValue: number;
  skinCount: number;
  img: string;
  color: string;
}

interface HorizontalWheelProps {
  participants: Participant[];
  winner: Participant | null; // Winner participant
  spinDuration: number; // Spin duration in milliseconds
  onSpinComplete?: () => void; // Callback when spin completes
}

interface WheelItemData {
  id: string;
  name: string;
  value: number;
  color: string;
}

const HorizontalWheel: React.FC<HorizontalWheelProps> = ({
  participants,
  winner,
  spinDuration,
  onSpinComplete,
}) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const controls = useAnimation();
  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelContainerRef = useRef<HTMLDivElement>(null); // Added reference to WheelContainer

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newAudio = new Audio(audiom);
      setAudio(newAudio);
    }
  }, []);

  // Calculate total value instead of total skins
  const totalValue = useMemo(() => {
    return participants.reduce((acc, participant) => acc + participant.totalValue, 0);
  }, [participants]);

  // Prepare wheel items based on participants
  const wheelItems: WheelItemData[] = useMemo(() => {
    return participants.map((participant) => ({
      id: participant.id, // Unique identifier
      name: participant.username,
      value: participant.totalValue, // Use totalValue for proportional segments
      color: participant.color,
    }));
  }, [participants]);

  // Duplicate wheel items for seamless looping
  const duplicatedWheelItems = useMemo(() => {
    return [...wheelItems, ...wheelItems, ...wheelItems, ...wheelItems, ...wheelItems];
  }, [wheelItems]);

  // Start the spin when winner is determined
  useEffect(() => {
    if (winner) {
      handleSpin(winner);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  const handleSpin = (winner: Participant) => {
    if (audio) {
      audio.play().catch((error) => {
        console.error("Audio playback failed:", error);
      });
    }

    // Find the winner's index based on unique 'color'
    const wheelItemColors = wheelItems.map((item) => item.color);
    const winnerIndex = wheelItemColors.indexOf(winner.color);
    if (winnerIndex === -1) return;

    // Calculate cumulative proportions
    const cumulativeProportions: number[] = [];
    wheelItems.reduce((acc, item, index) => {
      cumulativeProportions[index] = acc + item.value / totalValue;
      return cumulativeProportions[index];
    }, 0);

    // Calculate the spin distance to land on the winner's midpoint
    const winnerCumulativeStart =
      cumulativeProportions[winnerIndex] - wheelItems[winnerIndex].value / totalValue;
    const winnerProportion = wheelItems[winnerIndex].value / totalValue;
    const winnerMidpoint = winnerCumulativeStart + winnerProportion / 2;

    // Get the wheel's total scrollable width in pixels (original wheel width before duplication)
    const wheelElement = wheelRef.current;
    if (!wheelElement) return;
    const originalWheelWidth = wheelElement.scrollWidth / 5; // Since duplicated 5 times

    // Get the container's width
    const containerWidth = wheelContainerRef.current ? wheelContainerRef.current.offsetWidth : 0;

    // Calculate spin distance in pixels to land on the winner's midpoint
    // Adjusting for the container's width to center the winner under the pointer
    const spinDistancePixels = winnerMidpoint * originalWheelWidth - containerWidth / 2;

    // Calculate total rotation in pixels: loops * originalWheelWidth + spin distance
    const loops = 3; // Number of full loops before landing
    const totalRotationPixels = originalWheelWidth * loops + spinDistancePixels;

    // Animate the wheel to spin leftwards by totalRotationPixels
    controls
      .start({
        x: -totalRotationPixels,
        transition: { duration: spinDuration / 1000, ease: "easeOut" },
      })
      .then(() => {
        // Reset the wheel's position to prepare for the next spin
        controls.set({ x: -spinDistancePixels });
        // Call onSpinComplete if provided
        if (onSpinComplete) {
          onSpinComplete();
        }
      });
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Pointer Indicator at the Top */}
      <svg
        fill="#2E3746"
        className="absolute z-30 top-1 left-1/2 transform -translate-x-1/2 -rotate-180"
        height="30px"
        width="30px"
        viewBox="0 0 490 490"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="245,0 490,490 0,490" />
      </svg>

      {/* Wheel Container with Reference */}
      <WheelContainer ref={wheelContainerRef}>
        <Wheel animate={controls} totalValue={totalValue} ref={wheelRef}>
          {duplicatedWheelItems.map((item, index) => (
            <WheelItem
              key={`${item.id}-${index}`}
              value={item.value}
              bgColor={item.color}
              totalValue={totalValue}
            >
              {/* Display participant's name */}
              <div className="w-full flex justify-center items-center h-full">
                <span className="text-white font-bold">{item.name}</span>
              </div>
            </WheelItem>
          ))}
        </Wheel>
      </WheelContainer>

      {/* Pointer Indicator at the Bottom */}
      <svg
        fill="#2E3746"
        className="absolute z-30 bottom-1 left-1/2 transform -translate-x-1/2"
        height="30px"
        width="30px"
        viewBox="0 0 490 490"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polygon points="245,0 490,490 0,490" />
      </svg>
    </div>
  );
};

export default HorizontalWheel;
