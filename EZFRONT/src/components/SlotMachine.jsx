// SlotMachine.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const SlotMachine = ({ reels }) => {
  const [spinning, setSpinning] = useState(
    reels.map(() => false)
  );

  // Handle sequential spinning logic
  useEffect(() => {
    let isMounted = true; // To avoid state updates if component unmounts

    const spinReelsSequentially = async () => {
      while (isMounted) {
        // Start spinning each reel one by one
        for (let i = 0; i < reels.length; i++) {
          if (!isMounted) break;
          // Set the current reel to spinning
          setSpinning(prev => {
            const newSpinning = [...prev];
            newSpinning[i] = true;
            return newSpinning;
          });

          // Wait for 500ms before starting the next reel
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Wait for 2 seconds (total spin duration)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Stop spinning each reel one by one
        for (let i = 0; i < reels.length; i++) {
          if (!isMounted) break;
          // Set the current reel to not spinning
          setSpinning(prev => {
            const newSpinning = [...prev];
            newSpinning[i] = false;
            return newSpinning;
          });

          // Wait for 300ms before stopping the next reel
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Wait for 1 second before the next spin cycle
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    };

    spinReelsSequentially();

    return () => {
      isMounted = false; // Cleanup flag on unmount
    };
  }, [reels.length]);

  return (
    <div className="flex flex-col items-center justify-center">
      
      {/* Internal Styles for Animations and Shadows */}
      <style>
        {`
          @keyframes spin {
            0% { transform: translateY(0); }
            25% { transform: translateY(-100%); }
            50% { transform: translateY(-200%); }
            75% { transform: translateY(-300%); }
            100% { transform: translateY(0); }
          }
          @keyframes gradient-border {
            0% {
              border-color: #ff00c8;
            }

            100% {
              border-color: #ff00c8;
            }
          }
          @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: 200px 0; }
          }
          .animate-spin-reel {
            animation: spin 2s ease-in-out infinite;
          }
          .animate-gradient-border {
            animation: gradient-border 4s linear infinite;
            border-image: linear-gradient(45deg, #3D3A40, #76ABAE) 1;
          }
          .animate-shimmer {
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }
          .shadow-neon-blue {
            box-shadow: 0 0 20px #3D3A40, 0 0 40px #3D3A40;
          }
          .shadow-pink-neon {
            box-shadow: 0 0 10px #ff00c8, 0 0 20px #ff00c8;
          }
          .font-pacifico {
            font-family: 'Pacifico', cursive;
          }
        `}
      </style>

      <div className="flex flex-col items-center mt-10">
        {/* Neon Frame with Animated Gradient Border */}
        <div className="flex gap-1 p-2 border-4 animate-gradient-border rounded-lg">
          {reels.map((reel, index) => (
            <div key={index} className="w-12 h-12 overflow-hidden relative border-l-2 border-r-2 border-headerBackground rounded">
              <div className={`flex flex-col items-center text-5xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-transparent bg-clip-text shadow-pink-neon ${spinning[index] ? 'animate-spin-reel' : ''}`}>
                {reel.map((char, i) => (
                  <span key={i} className="block">{char}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

SlotMachine.propTypes = {
  reels: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default SlotMachine;






// // SlotMachine.jsx
// import React, { useEffect, useState } from 'react';

// const SlotMachine = () => {
//   // Initialize spinning states for each reel (7 reels)
//   const [spinning, setSpinning] = useState([false, false, false, false, false, false, false]);

//   const [reels] = useState([
//     ['J', 'A', 'C', 'K', 'P', 'O', 'T'],
//     ['A', 'C', 'K', 'P', 'P', 'O', 'T'],
//     ['C', 'K', 'P', 'O', 'P', 'O', 'T'],
//     ['K', 'P', 'O', 'T', 'P', 'O', 'T'],
//     ['P', 'O', 'T', 'J', 'A', 'C', 'K'],
//     ['O', 'T', 'J', 'A', 'C', 'K', 'P'],
//     ['T', 'J', 'A', 'C', 'K', 'P', 'O'],
//   ]);

//   // Handle sequential spinning logic
//   useEffect(() => {
//     let isMounted = true; // To avoid state updates if component unmounts

//     const spinReelsSequentially = async () => {
//       while (isMounted) {
//         // Start spinning each reel one by one
//         for (let i = 0; i < reels.length; i++) {
//           if (!isMounted) break;
//           // Set the current reel to spinning
//           setSpinning(prev => {
//             const newSpinning = [...prev];
//             newSpinning[i] = true;
//             return newSpinning;
//           });

//           // Wait for 500ms before starting the next reel
//           await new Promise(resolve => setTimeout(resolve, 500));
//         }

//         // Wait for 2 seconds (total spin duration)
//         await new Promise(resolve => setTimeout(resolve, 2000));

//         // Stop spinning each reel one by one
//         for (let i = 0; i < reels.length; i++) {
//           if (!isMounted) break;
//           // Set the current reel to not spinning
//           setSpinning(prev => {
//             const newSpinning = [...prev];
//             newSpinning[i] = false;
//             return newSpinning;
//           });

//           // Wait for 300ms before stopping the next reel
//           await new Promise(resolve => setTimeout(resolve, 300));
//         }

//         // Wait for 1 second before the next spin cycle
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       }
//     };

//     spinReelsSequentially();

//     return () => {
//       isMounted = false; // Cleanup flag on unmount
//     };
//   }, [reels.length]);

//   return (
//     <div className="flex flex-col items-center justify-center ">
      
//       {/* Internal Styles for Animations and Shadows */}
//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: translateY(0); }
//             25% { transform: translateY(-100%); }
//             50% { transform: translateY(-200%); }
//             75% { transform: translateY(-300%); }
//             100% { transform: translateY(0); }
//           }
//           @keyframes gradient-border {
//             0% {
//               border-color: #ff00c8;
//             }

//             100% {
//               border-color: #ff00c8;
//             }
//           }
//           @keyframes shimmer {
//             0% { background-position: -200px 0; }
//             100% { background-position: 200px 0; }
//           }
//           .animate-spin-reel {
//             animation: spin 2s ease-in-out infinite;
//           }
//           .animate-gradient-border {
//             animation: gradient-border 4s linear infinite;
//             border-image: linear-gradient(45deg, #3D3A40, #76ABAE) 1;
//           }
//           .animate-shimmer {
//             background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
//             background-size: 200px 100%;
//             animation: shimmer 2s infinite;
//           }
//           .shadow-neon-blue {
//             box-shadow: 0 0 20px #3D3A40, 0 0 40px #3D3A40;
//           }
//           .shadow-pink-neon {
//             box-shadow: 0 0 10px #ff00c8, 0 0 20px #ff00c8;
//           }
//           .font-pacifico {
//             font-family: 'Pacifico', cursive;
//           }
//         `}
//       </style>

//       <div className="flex flex-col items-center space-y-5 py-8">
//         {/* Gradient Heading */}


//         {/* Neon Frame with Animated Gradient Border */}
//         <div className="flex gap-2 p-5 border-4 animate-gradient-border rounded-lg">
//           {reels.map((reel, index) => (
//             <div key={index} className="w-12 h-12 overflow-hidden relative border-l-2 border-r-2 border-headerBackground rounded">
//               <div className={`flex flex-col items-center text-5xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 text-transparent bg-clip-text shadow-pink-neon ${spinning[index] ? 'animate-spin-reel' : ''}`}>
//                 {reel.map((char, i) => (
//                   <span key={i} className="block">{char}</span>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SlotMachine;



